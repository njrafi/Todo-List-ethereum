const { assert } = require("chai");

const TodoList = artifacts.require("./TodoList.sol");

contract("TodoList", (accounts) => {
	before(async () => {
		this.todoList = await TodoList.deployed();
	});

	it("deployed successfully", async () => {
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

	it("Creates task", async () => {
		const result = await this.todoList.createTask("A new task");

		const taskCount = await this.todoList.taskCount();
		assert.equal(taskCount, 3);

		const event = result.logs[0].args;
		assert.equal(event.id.toNumber(), 3);
		assert.equal(event.content, "A new task");
		assert.equal(event.completed, false);
	});
});
