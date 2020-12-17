const app = require('./app')
const port = process.env.PORT

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome',
        name: 'Mihai Ghe'
    })
})

app.get('/user', (req, res) => {
    
    res.render('user', {
        title: 'UserProfile',
        name: 'Mihai Ghe'
    })
})

app.get('/task', (req, res) => {
    
    res.render('task', {
        title: 'Task',
        name: 'Mihai Ghe'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Mihai Ghe',
        errorMessage: 'Page not found.'
    })
})