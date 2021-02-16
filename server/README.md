# BACKEND

## Getting Started

This project uses the following tools. Go check them out if you don't have them locally installed.

- [docker](https://www.docker.com/)
- [node 14.15.X](https://nodejs.org/en/)

Build the project.

1. git clone git@github.com:AlanSyue/tomatoClockForPractice.git
2. cd tomatoClockForPractice/server
3. npm install
4. docker-compose up -d
5. npm run start

## API Spec
[document](https://hackmd.io/kBm7TsFPRNySgCK619LUmw)

### Overview

Header
- Accept: application/json
- Content-Type: application/json

API 簡介
- GET  `/api/tasks` 取得全部待辦事項
- POST `/api/tasks` 新增待辦事項 
- PATCH `/api/tasks/:id` 修改指定待辦事項資料
- DELETE `/api/tasks/:id` 刪除待辦事項
- GET `/api/reports` 取得專注度報表

### 取得全部待辦事項 GET `/api/tasks` 


Request Parameter
```jsx
{
    // optional parameter
    // oneOf ("", completed","uncompleted")
    // default ""
    filterType: "string"
}
```


Response

```jsx
{
    status: 200,
    data: {
        tasks: [
            {
                id: 1,
                content: "通識課作業",
                completed: false,
                completedAt: null,
                createdAt: "2021-02-11T09:03:00.910Z",
                updatedAt: "2021-02-11T09:03:00.910Z",
            },
            {
                id: 2,
                content: "選課",
                completed: false,
                completedAt: null,
                createdAt: "2021-02-11T09:03:00.910Z",
                updatedAt: "2021-02-11T09:03:00.910Z",
            },
            // ...
        ]
    }
}
```

Testing curl
```jsx
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://yourapiserver/api/tasks
```

### 新增待辦事項 POST `/api/tasks` 

Request Parameter
```jsx
{
    // required ""
    content: "string"
}
```



Response Success

```jsx
{
    status: 201,
    data: {
        {
            id: 3,
            content: "買晚餐",
            completed: false,
            completedAt: null,
            createdAt: "2021-02-11T09:03:00.910Z",
            updatedAt: "2021-02-11T09:03:00.910Z",
        }
    }
}
```

Response Failure


```jsx
{
    status: 400,
    message: "'content' is required parameter."
}
```

Testing Curl

```jsx
curl -X POST -H "Content-Type: application/json" -d '{"content" : "必修課作業" }' "http://www.example.com/api/tasks"
```


### 修改指定待辦事項資料 Patch `/api/tasks/:id` 

Request Parameter
```jsx
{
    // optional parameter
    "content": string,
    // optional parameter
    "completed": bool
}
```

Response Success

```jsx
{
    status: 200,
    data: {
        {
            id: 3,
            content: "買晚餐",
            completed: true,
            completedAt: "2021-02-12T09:03:00.910Z",
            createdAt: "2021-02-11T09:03:00.910Z",
            updatedAt: "2021-02-12T09:03:00.910Z",
        }
    }
}
```

Testing Curl

```jsx
curl -X PATCH -H "Content-Type: application/json" -d '{"content" : "必修課作業" }' "http://www.example.com/api/tasks/4"
```

```jsx
curl -X PATCH -H "Content-Type: application/json" -d '{"completed" : "true" }' "http://www.example.com/api/tasks/1"
```

### 刪除待辦事項 DELETE `/api/tasks/:id` 

Request

```jsx
{}
```

Response Success

```jsx
{
    status: 200,
    data: {}
}
```


Testing Curl

```jsx
curl -X DELETE "https://yourapiserver/api/tasks/1"
```

### 取得專注度報表 GET `/api/reports`

Request Parameter

```jsx
{}
```

Response Success

```jsx
{
    status: 200,
    data: {
        todayReport: {
            createdTotal: 3,
            completedTotal: 1
        },
        weeklyReport: {
            createdTotal: 15,
            completedTotal: 10
        },
        dailyReport: [
            {date: "7/06", createdTotal: 3, completedTotal:1},
            {date: "7/07", createdTotal: 4, completedTotal:4},
            {date: "7/08", createdTotal: 5, completedTotal:3},
            {date: "7/09", createdTotal: 0, completedTotal:0},
            {date: "7/10", createdTotal: 3, completedTotal:2},
            {date: "7/11", createdTotal: 0, completedTotal:0},
            {date: "7/12", createdTotal: 0, completedTotal:0}
        ]
    }
}
```


Testing curl
```jsx
curl -H "Accept: application/json" -H "Content-Type: application/json" -X GET https://yourapiserver/api/reports
```
