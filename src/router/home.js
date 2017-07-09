function* index(){
    console.log('index') //eslint-disable-line
	yield this.send('asdasd')
}

export default [
	{method: 'get', name: 'index', url: '/', middleware: index}
]