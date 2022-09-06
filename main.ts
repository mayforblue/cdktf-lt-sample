import { Construct } from 'constructs'
import { App, TerraformStack } from 'cdktf'
import { AwsProvider, s3 } from '@cdktf/provider-aws'
import { GoogleProvider, StorageBucket } from '@cdktf/provider-google'
import * as path from 'path'
import * as fs from 'fs'

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name)

    // AWS
    new AwsProvider(this, 'aws', { region: 'ap-northeast-1' })

    new s3.S3Bucket(this, 'bucket', {
      bucket: 'BUCKET_NAME',
    })

    // Google Cloud
    const credentialsPath = path.join(__dirname, 'google.json')
    const credentials = fs.existsSync(credentialsPath)
      ? fs.readFileSync(credentialsPath).toString()
      : '{}'

    new GoogleProvider(this, 'googleCloud', {
      region: 'asia-northeast1',
      project: 'PROJECT_NAME',
      credentials,
    })

    new StorageBucket(this, 'strageBucket', {
      name: 'BUCKET_NAME',
      location: 'ASIA-NORTHEAST1',
    })
  }
}

const app = new App()
new MyStack(app, 'cdktf-lt-sample')
app.synth()
