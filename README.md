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

## **[Google Search Console](https://search.google.com/search-console)** profile

| email                | Indexed |
| -------------------- | ------- |
| xcodeclazz@gmail.com | **No**  |

## **[Google My Business](https://www.google.com/business)** profile

| email                | Indexed |
| -------------------- | ------- |
| xcodeclazz@gmail.com | **No**  |

## Workflow Env

> You can pre create these, since these details are not tighly coupled with this repository

- WF\_<span style="color:lightblue;">**DISCORD**</span>\_WEBHOOK_URL : `https://discord.com/api/webhooks/1192732245396566046/fcnrRcCydgtgTAfDSUf1g2X1Qe01jQP7ibz4BEQe9vbnPOGK10qvxmvKFRRPNRTgmsEW`
- WF\_<span style="color:green;">**RABBIT_MQ**</span>\_STAGE_URI : `amqp://stage:OzzaE2D1IapNSbp2wue1TPORuNzTWFgK25u0YgRb@stage.mq.72hoor.in:5673`
- WF\_<span style="color:green;">**RABBIT_MQ**</span>\_PRODUCTION_URI : `amqp://admin:EbArklvivXO3aGiyjVN1EB9xY8kXghvBtSWhxp5F@mq.72hoor.in:5672`
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
- WF\_<span style="color:green;">**ADMIN_PASSWORD**</span>\_STAGE : `SW5ziV9wGzq1wxOb8dok5ua2EjzHr5Tgf93GOQcF`
- WF\_<span style="color:green;">**ADMIN_PASSWORD**</span>\_PRODUCTION : `SW5ziV9wGzq1wxOb8dok5ua2EjzHr5Tgf93GOQcF`
- WF\_<span style="color:purple;">**BACKEND**</span>\_PRODUCTION_URL : `/`
- WF\_<span style="color:purple;">**BACKEND**</span>\_STAGE_URL : `/`
- WF\_<span style="color:orange;">**MONOLITHIC**</span>\_PRODUCTION_URL : `https://api.xcodeclazz.com/`
- WF\_<span style="color:orange;">**MONOLITHIC**</span>\_STAGE_URL : `https://stage.api.xcodeclazz.com/`

> Once you have docker image on dockerhub

- WF\_<span style="color:green;">**RENDER**</span>\_STAGE_APP_SERVICE_ID : `srv-cmbs6fn109ks73aep880`
- WF\_<span style="color:green;">**RENDER**</span>\_PRODUCTION_APP_SERVICE_ID : `srv-cmbs82mn7f5s7392jb3g`
- WF\_<span style="color:green;">**RENDER**</span>\_STAGE_PROFILE_AUTH_API_TOKEN : `rnd_kxFLhZAeeHaIUVquxx2KvbxWW94C`
- WF\_<span style="color:green;">**RENDER**</span>\_PRODUCTION_PROFILE_AUTH_API_TOKEN : `rnd_BLSL3BZWyZAQfniYhpbZixv0xm6L`

## Keep in mind

- Update your repository secrets
- Make your mongodb accessed from anywhere
- Make your docker image private once they published
- Use lower case for login and building docker images

### Rollback

- Todo
