# Address Table Server

Very simple round-robin method load balancer docker image

### Requirement

Create these branches: `master`, `stage`, `production`

## **[Docker](https://hub.docker.com)** profile

| username         | Password       | Image(s)                                      |
| ---------------- | -------------- | --------------------------------------------- |
| carolinaalbertus | Phpmyadmin920@ | carolinaalbertus/address-table-server-stage   |
| yevdokiyaalex    | Phpmyadmin920@ | yevdokiyaalex/address-table-server-production |

## **[Render](https://render.com)** profile

| email                      | Password       | Image                                         |
| -------------------------- | -------------- | --------------------------------------------- |
| CarolinaAlbertus@proton.me | Phpmyadmin920@ | carolinaalbertus/address-table-server-stage   |
| YevdokiyaAlex@proton.me    | Phpmyadmin920@ | yevdokiyaalex/address-table-server-production |

## **[MongoDB](https://www.mongodb.com)** profile

> **Allow Access From Anywhere**

| email                      | Password       | Database   |
| -------------------------- | -------------- | ---------- |
| CarolinaAlbertus@proton.me | Phpmyadmin920@ | Stage      |
| YevdokiyaAlex@proton.me    | Phpmyadmin920@ | Production |

## Workflow Env

> You can pre create these, since these details are not tighly coupled with this repository

- WF\_<span style="color:lightblue;">**SLACK**</span>\_WEBHOOK_URL : `https://hooks.slack.com/services/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`
- WF\_<span style="color:red;">**DOCKER**</span>\_STAGE_ACCOUNT_USERNAME : `carolinaalbertus`
- WF\_<span style="color:red;">**DOCKER**</span>\_STAGE_ACCOUNT_PASSWORD : `Phpmyadmin920@`
- WF\_<span style="color:red;">**DOCKER**</span>\_STAGE_IMAGE_NAME : `carolinaalbertus/address-table-server-stage`
- WF\_<span style="color:red;">**DOCKER**</span>\_PRODUCTION_ACCOUNT_USERNAME : `yevdokiyaalex`
- WF\_<span style="color:red;">**DOCKER**</span>\_PRODUCTION_ACCOUNT_PASSWORD : `Phpmyadmin920@`
- WF\_<span style="color:red;">**DOCKER**</span>\_PRODUCTION_IMAGE_NAME : `yevdokiyaalex/address-table-server-production`
- WF\_<span style="color:yellow;">**MONGODB**</span>\_STAGE_DATABASE_NAME : `address-table-server-stage`
- WF\_<span style="color:yellow;">**MONGODB**</span>\_PRODUCTION_DATABASE_NAME : `address-table-server-production`
- WF\_<span style="color:yellow;">**MONGODB**</span>\_PRODUCTION_URI : `mongodb+srv://yevdokiyaalex:3K30GDyxbx3WH2yN@cluster0.ojus2vo.mongodb.net`
- WF\_<span style="color:yellow;">**MONGODB**</span>\_STAGE_URI : `mongodb+srv://carolinaalbertus:FHocQCFpHod4Qxo9@cluster0.blyw8bd.mongodb.net`
- WF\_<span style="color:green;">**ADMIN_PASSWORD**</span>\_STAGE : `Phpmyadmin920@`
- WF\_<span style="color:green;">**ADMIN_PASSWORD**</span>\_PRODUCTION : `Phpmyadmin920@`

> Once you have docker image on dockerhub

- WF\_<span style="color:green;">**RENDER**</span>\_STAGE_APP_SERVICE_ID : `null`
- WF\_<span style="color:green;">**RENDER**</span>\_PRODUCTION_APP_SERVICE_ID : `null`
- WF\_<span style="color:green;">**RENDER**</span>\_STAGE_PROFILE_AUTH_API_TOKEN : `null`
- WF\_<span style="color:green;">**RENDER**</span>\_PRODUCTION_PROFILE_AUTH_API_TOKEN : `null`

## Keep in mind

- Update your repository secrets
- Make your mongodb accessed from anywhere
- Make your docker image private once they published
- Use lower case for login and building docker images

### Rollback

- Todo
