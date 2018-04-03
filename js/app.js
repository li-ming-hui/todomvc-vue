;
(function (window, Vue) {
	// const todos = [
	// {
	// 	id: 1,
	// 	title: '吃饭',
	// 	done: true
	// },
	// {
	// 	id: 1,
	// 	title: '睡觉',
	// 	done: false
	// },
	// {
	// 	id: 1,
	// 	title: '打代码',
	// 	done: true
	// },
	// {
	// 	id: 1,
	// 	title: '打豆豆',
	// 	done: false
	// }
	// ]

	const todos = JSON.parse(window.localStorage.getItem('todos')) || []
	const app = new Vue({
		el: '#todoapp',
		data: {
			todos, //任务列表数据源
			inputText: '', //用来绑定获取添加任务文本框的数据
			currentEdit: null,
			filterTodos: [], //用来判定任务项是否获得editing样式的一个标记变量
			backtitle: '', //仅仅用于备份我们的编辑之前的任务项的 title，编辑之前先备份，取消编辑回退
			hash: ''
		},

		methods: {
			// 添加任务项
			addTodo(e) {
				// 拿到文本框数据
				// const inputText=this.inputText;
				// const todos=this.todos
				const {
					inputText,
					todos
				} = this;

				// 非空验证
				if (inputText.trim().length === 0) {
					return
				}

				// 获取唯一的id
				const lastItem = todos[todos.length - 1]
				const id = lastItem ? lastItem.id + 1 : 1

				// 添加到数组中(unshif--往前添加)
				this.todos.push({
					id,
					title: this.inputText,
					done: false
				})

				// 添加到本地存储
				// window.localStorage.setItem('todos', JSON.stringify(todos))

				// 清空文本框
				this.inputText = '';
			},

			// 删除单个任务项
			removeTodo(index) {
				this.todos.splice(index, 1);
			},

			// 获取编辑样式
			getEditing(item) {
				// 将currentEdit赋值为当前双击任务项
				this.currentEdit = item
				this.backTitle = item.title
			},

			// 回车或者失去焦点保存编辑
			saveEdit(item, index) {
				// 判断被编辑的任务项的文本是否为空
				// 如果为空，则直接删除
				// 如果不为空，则保存编辑，去除编辑样式
				if (item.title.trim().length === 0) {
					//执行删除操作
					this.todos.splice(index, 1)
				} else {
					this.currentEdit = null
				}
			},

			// ESC取消编辑
			// 取消编辑时也触发了失去焦点事件
			cancalEdit() {
				// 让任务项的title回归原始数据
				// 去除编辑样式
				this.currentEdit.title = this.backTitle
				this.currentEdit = null
			},

			// 显示所有未完成的任务量
			getRemaining() {
				return this.todos.filter(item => !item.done).length
			},

			// 清除所有已完成任务项
			clearAllDone() {
				const todos = this.todos
				for (let i = 0; i < todos.length; i++) {
					if (todos[i].done === true) {
						// 执行删除操作
						todos.splice(i, 1)
						// 让索引倒退一次，防止有漏网之鱼
						i--
					}
				}
			},

			// 切换所有任务的完成状态
			// toggleAll (e) {
			// 	const {checked} = e.target
			// 	this.todos.forEach(function (item) {
			// 		item.done = checked
			// 	})
			// }
		},

		computed: {
			remaining() {
				return this.todos.filter(item => !item.done).length
			},

			// 切换所有的任务完成状态
			toggleAllStat: {
				get: function () {
					const toggleAll = this.todos.every(function (item) {
						return item.done === true
					})
					return toggleAll
				},
				set: function (val) {
					this.todos.forEach(function (item) {
						item.done = val
					})
				}
			},
			// filterTodos(){

			// }
		},

		watch: {
			todos: {
				handler: function () {
					window.localStorage.setItem('todos', JSON.stringify(this.todos))
				},
				deep: true
			},
		}
	})

	window.app = app

	window.onhashchange = function () {
		const {	hash } = window.location

		// 修改实例中的属性 hash 从而影响用来过滤数据的 a 链接的样式
		app.hash = hash

		// 根据 hash 的不同过滤数据的展示
		switch (hash) {
			case '':
			case '#/':
				app.filterTodos = app.todos
				break
			case '#/active':
				app.filterTodos = app.todos.filter(function (item) {
					return item.done === false
				})
				break
			case '#/completed':
				app.filterTodos = app.todos.filter(function (item) {
					return item.done === true
				})
				break
		}
	}
	window.onhashchange()

})(window, Vue)
