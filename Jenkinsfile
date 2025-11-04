pipeline {
    agent any

    stages {
        stage('Test') {
            steps {
                script {
                    docker.build('getting-started-todo-app', '--target test .')
                }
            }
        }
    }
}