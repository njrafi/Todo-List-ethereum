const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", (accounts) => {
	before(async () => {
		this.todoList = await TodoList.deployed();
	});

	it("deploys successfully", async () => {
		const address = await this.todoList.address;
		assert.notEqual(address, 0x0);
		assert.notEqual(address, "");
		assert.notEqual(address, null);
		assert.notEqual(address, undefined);
	});

	it("lists tasks", async () => {
		const taskCount = await this.todoList.taskCount();

		assert.equal(taskCount.toNumber(), 2);

		const task1 = await this.todoList.tasks(1);
		assert.equal(task1.id.toNumber(), 1);
		assert.equal(task1.content, "I am a disco dancer");
		assert.equal(task1.completed, false);

		const task2 = await this.todoList.tasks(2);
		assert.equal(task2.id.toNumber(), 2);
		assert.equal(task2.content, "Biri khaile hoy cancer");
		assert.equal(task2.completed, false);
	});
});
