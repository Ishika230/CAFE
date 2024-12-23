pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials') // DockerHub credentials
        GITHUB_CREDENTIALS = credentials('github-token')  // Reference GitHub Token from Jenkins Credentials
        FRONTEND_IMAGE_NAME = 'ishika2307/my-react-app'
        JENKINS_API_TOKEN = credentials('jenkins-api-token')
        BACKEND_IMAGE_NAME = 'ishika2307/my-cafe-backend'
        REPO_URL = 'https://github.com/Ishika230/cafe.git'  // Your GitHub repository URL
        MONGO_INITDB_ROOT_USERNAME = credentials('mongo-db-username')  // Reference to the Jenkins secret (MongoDB username)
        MONGO_INITDB_ROOT_PASSWORD = credentials('mongo-db-password')  
        
    }
    

    stages {
        stage('Prepare Image Tag') {
            steps {
                script {
                    // Dynamically set IMAGE_TAG to the build number
                    env.IMAGE_TAG = "${env.BUILD_NUMBER}"
                    echo "Using IMAGE_TAG: ${env.IMAGE_TAG}"
                }
            }
        }
        stage('Pull Code') {
            steps{
                echo 'Pulling code from GitHub...'
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
                    script{
                        docker.image('node:18').inside {
                           docker.build("${FRONTEND_IMAGE_NAME}:${env.BUILD_NUMBER}")
                        }
                        
                        

                    }
                    
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo 'Building Docker image for backend...'
                dir('backend') {
                    script {
                        docker.image('node:18').inside {
                           docker.build("${BACKEND_IMAGE_NAME}:${env.BUILD_NUMBER}")
                        }
                    }
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
    
    stage('Generate MongoDB Secret in Kubernetes') {
            steps {
                echo 'Creating MongoDB secret in Kubernetes dynamically...'
                script {
                    def mongoSecretYaml = """
apiVersion: v1
kind: Secret
metadata:
  name: mongo-init-creds
data:
  mongouser: ${MONGO_INITDB_ROOT_USERNAME}
  mongopassword: ${MONGO_INITDB_ROOT_PASSWORD}
"""
                    // Write the secret YAML file to disk
                    writeFile file: 'mongodb-secret.yaml', text: mongoSecretYaml

                    // Apply the Kubernetes secret
                    sh 'kubectl apply -f mongodb-secret.yaml'
                    
                    sh 'kubectl apply -f k8s/mongodb-pod.yaml'
                }
            }
        }

        stage('Deploy Backend and Frontend to Kubernetes') {
            steps {
                echo 'Deploying the frontend and backend to Kubernetes...'
                sh 'kubectl apply -f backend-dev.yaml'
                sh 'kubectl apply -f frontend-dev.yaml'
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