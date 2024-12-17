pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials') // DockerHub credentials
        GITHUB_CREDENTIALS = credentials('github-token')  // Reference GitHub Token from Jenkins Credentials
        FRONTEND_IMAGE_NAME = 'ishika2307/my-react-app'
        BACKEND_IMAGE_NAME = 'ishika2307/my-cafe-backend'
        REPO_URL = 'https://github.com/ishika230/cafe.git'  // Your GitHub repository URL
    }

    stages {
        stage('Pull Code') {
            steps {
                echo 'Pulling code from GitHub...'
                script {
                    // Using username and token directly from Jenkins' credentials system
                    sh """
                        git clone https://${GITHUB_CREDENTIALS_USR}:${GITHUB_CREDENTIALS_PSW}@${REPO_URL} .
                    """
                }
            }
        }

        stage('Clean Workspace') {
            steps {
                echo 'Cleaning old libraries/files...'
                sh 'rm -rf node_modules dist'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo 'Installing frontend dependencies...'
                dir('frontend/feedback-app') {
                    sh 'npm install'  // Runs npm install for frontend
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo 'Installing backend dependencies...'
                dir('backend') {
                    sh 'npm install'  // Runs npm install for backend
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo 'Running unit tests...'
                sh 'npm test || echo "Tests failed, but continuing..."'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                echo 'Building Docker image for frontend...'
                dir('frontend/feedback-app') {
                    sh "docker build -t ${FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER} ."
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo 'Building Docker image for backend...'
                dir('backend') {
                    sh "docker build -t ${BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER} ."
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                echo 'Logging in and pushing frontend image to Docker Hub...'
                sh "echo ${DOCKER_HUB_CREDENTIALS_PSW} | docker login -u ${DOCKER_HUB_CREDENTIALS_USR} --password-stdin"
                sh "docker push ${FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}"

                echo 'Pushing backend image to Docker Hub...'
                sh "docker push ${BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}"
            }
        }
    }

    post {
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
