App = {
	contracts: {},
	loading: false,

	loadWeb3: async () => {
		if (typeof web3 !== "undefined") {
			App.web3Provider = web3.currentProvider;
			web3 = new Web3(web3.currentProvider);
		} else {
			window.alert("Please connect to Metamask.");
		}
		// Modern dapp browsers...
		if (window.ethereum) {
			window.web3 = new Web3(ethereum);
			try {
				// Request account access if needed
				await ethereum.enable();
				// Acccounts now exposed
				web3.eth.sendTransaction({
					/* ... */
				});
			} catch (error) {
				// User denied account access...
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			App.web3Provider = web3.currentProvider;
			window.web3 = new Web3(web3.currentProvider);
			// Acccounts always exposed
			web3.eth.sendTransaction({
				/* ... */
			});
		}
		// Non-dapp browsers...
		else {
			console.log(
				"Non-Ethereum browser detected. You should consider trying MetaMask!"
			);
		}
	},

	loadAccount: async () => {
		App.account = web3.eth.accounts[0];
		console.log(App.account);
		web3.eth.defaultAccount = web3.eth.accounts[0];
	},

	loadContract: async () => {
		const todoList = await $.getJSON("TodoList.json");
		App.contracts.TodoList = TruffleContract(todoList);
		App.contracts.TodoList.setProvider(App.web3Provider);

		App.todoList = await App.contracts.TodoList.deployed();
	},

	setLoading: (isLoading) => {
		App.loading = isLoading;
		const loader = $("#loader");
		const content = $("#content");

		if (isLoading) {
			loader.show();
			content.hide();
		} else {
			loader.hide();
			content.show();
		}
	},

	createTask: async () => {
		App.setLoading(true);

		const newTask = $("#newTask").val();
		await App.todoList.createTask(newTask);
		window.location.reload();
	},

	toggleCompletion: async (taskId) => {
		console.log("toggle completion called with taskID = ", taskId);
		await App.todoList.toggleCompleted(taskId);
		window.location.reload();
	},

	renderTasks: async () => {
		// Load the total task count from the block chain
		const taskCount = await App.todoList.taskCount();
		const $taskTemplate = $(".taskTemplate");

		// Render out each task with a new task template
		for (let i = 1; i <= taskCount; i++) {
			const task = await App.todoList.tasks(i);
			const taskId = task[0].toNumber();
			const taskContent = task[1];
			const taskCompleted = task[2];

			// Create the html for the task
			const $newTaskTemplate = $taskTemplate.clone();
			$newTaskTemplate.find(".content").html(taskContent);
			$newTaskTemplate
				.find("input")
				.prop("name", taskId)
				.prop("checked", taskCompleted)
				.on("click", async () => {
					App.toggleCompletion(taskId);
				});

			// Put the task in the correct list
			if (taskCompleted) {
				$("#completedTaskList").append($newTaskTemplate);
			} else {
				$("#taskList").append($newTaskTemplate);
			}

			// Show the task
			$newTaskTemplate.show();
		}
	},

	render: async () => {
		if (App.loading) return;

		App.setLoading(true);

		$("#account").html(App.account);
		await App.renderTasks();

		App.setLoading(false);
	},

	load: async () => {
		await App.loadWeb3();
		await App.loadAccount();
		await App.loadContract();
		await App.render();
	},
};

$(() => {
	$(window).load(() => {
		App.load();
	});
});
