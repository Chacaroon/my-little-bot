function* index(){
	yield console.log('index') //eslint-disable-line
}

export default [
	{method: 'get', name: 'index', url: '/', middleware: index}
]