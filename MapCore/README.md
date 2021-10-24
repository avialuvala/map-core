# MapCore

Containerized .NET Core 2.0 version of national maps

-  maps are hosted in Fargate  for performance reasons.
- See "Publish Docker image" below for Docker image and AWS publishing instructions.
- Rather than hit a database, national maps read from a JSON configuration stored in S3 buckets. See "Publish Private JSON Files" for more details. 
- Public files (such as national XLSX summaries), are also stored in S3 buckets. See "Publish Public Static Files" for more details. 
- These JSON files are built when [MapCore Admin](../MapCore.Admin) reads a [local flat file (generally a CSV) and a ToolConfig.json file](../MapCore.Admin/json/100)

---

## Sources

- [ASP.NET Core Overview](https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-2.2)
- [AWS publish process](https://github.com/aws-samples/amazon-ecs-fargate-aspnetcore/)
- [Local AWS credentials to Docker compose up](https://stackoverflow.com/a/49956609)

---

## Notes

(Things that caused much head banging)

- IIS cannot be running at the same time as the `docker compose up` command
- The environment variables AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY/AWS_SESSION_TOKEN were not set with AWS credentials.
- Run docker images locally: `docker-compose up`
- Show all local Docker images `docker images`
- Delete a local Docker image `docker image rm [OPTIONS] IMAGE [IMAGE...]`

---

## Publish Docker Application Image

### 0. Prerequisites
- If pushing to prod, change nginx.conf file located at "dag.map-framework\reverseproxy" (****** very important ******)
- You must have the [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) installed with sufficient credentials 
- You must have Docker for Windows installed and running **Linux** containers.  

### 1. Locally, in git BASH

```bash
cd MapCore
dotnet build
rm -rf bin/Release/netcoreapp2.2/publish
dotnet publish -c "Release"
docker-compose -f ../docker-compose.yml build
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 546140078785.dkr.ecr.us-east-1.amazonaws.com
docker tag map-core_app:latest 546140078785.dkr.ecr.us-east-1.amazonaws.com/map_core_app:latest
docker push 546140078785.dkr.ecr.us-east-1.amazonaws.com/map_core_app:latest
docker tag map-core_reverseproxy:latest 546140078785.dkr.ecr.us-east-1.amazonaws.com/reverseproxy:latest
docker push 546140078785.dkr.ecr.us-east-1.amazonaws.com/reverseproxy:latest
aws ecs update-service --cluster map-core --service map-core-service-01 --force-new-deployment
echo Fin
```

### 2. In AWS, force a Fargate update

1. Log into [AWS]
2. In the [ECR console](https://console.aws.amazon.com/ecr/repositories?region=us-east-1) verify that the latest version of map_core_app and/or reverseproxy exist.
3. In [ECS](https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters), select **map-core**
4. In the Services tab, check off map-core-service-01 and click the **Update** button.
5. Check the **Force new deployment** checkbox, then click **Next step**
6. On the Configure network page, make no changes and click **Next step**
7. On the Set Auto Scaling page, optionally turn auto-scaling on or off 
8. Click **Update Service**
9. If all goes well, you will see a success checkmark and "Service updated". Click **View Service**.
10. In the Tasks tab, you will notice that the new Tasks take a few minutes to spin up, and the old Tasks will linger in production until the new Tasks are successfully deployed. You may need to wait a few minutes before the latest version is live.

---

## Publish Public Static Files

*Public* static files (such as the XLS downloads) should be uploaded from ./Mapcore/static to s3://com-maps-avi[-dev]
[Further reading](https://docs.aws.amazon.com/cli/latest/userguide/cli-services-s3-commands.html)

Prod:

```bash
cd MapCore
aws s3 sync ./static s3://com-maps-avi-static
```

---

## Publish Private JSON Files

*Private* static files (such as the JSON marker data) should be uploaded from ./Mapcore.Admin/json-output to s3://com-maps-avi-private[-dev]
[Further reading](https://docs.aws.amazon.com/cli/latest/userguide/cli-services-s3-commands.html)

Note: You may need to modify the [aws-cli.py file](https://stackoverflow.com/a/55276562) to get the encoding to work.

Dev:

```bash
cd Mapcore.Admin
aws s3 sync ./json-output s3://com-maps-avi-private-dev
aws ecs update-service --cluster map-core --service map-core-service-01 --force-new-deployment
```

Prod:

```bash
cd Mapcore.Admin
aws s3 sync ./json-output s3://com-amaps-avi-private
aws ecs update-service --cluster map-core --service map-core-service-01 --force-new-deployment
```