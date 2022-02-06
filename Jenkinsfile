pipeline{
    agent any
	stages{
        stage("Build to develop"){
           when{
               branch 'develop'
            }
           steps{
                 sh 'npm install --unsafe-perm'
                 sh 'npm run build:dev'
                 sh 'sh $LECTURER_JOB/auto_deploy_lecturer-root-fe.sh develop'
                }
         }
        stage("Build to transcode"){
           when{
               branch 'transcode'
            }
           steps{
                 sh 'npm install --unsafe-perm'
                 sh 'npm run build:dev'
                 sh 'sh $LECTURER_JOB/auto_deploy_lecturer-root-fe.sh transcode'
                }
         }
        stage("Build to feature/ft20220125"){
           when{
               branch 'feature/ft20220125'
            }
           steps{
                 sh 'npm install --unsafe-perm'
                 sh 'npm run build:dev'
                 sh 'sh $LECTURER_JOB/auto_deploy_lecturer-root-fe.sh feature/ft20220125'
                }
         }
        stage("Build to feature/ft20210930"){
           when{
               branch 'feature/ft20210930'
            }
           steps{
                 sh 'npm install --unsafe-perm'
                 sh 'npm run build:dev3'
                 sh 'sh $LECTURER_JOB/auto_deploy_lecturer-root-fe.sh feature/ft20210930'
                }
         }
    }
}
