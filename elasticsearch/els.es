GET /user/_search 
{
    "query": {
        "bool": {
            "filter": {
                "range": {
                    "USER_MK_DT": {
                        "gte": "2020-01-01",
                        "format": "yyyy-MM-dd",
                        "time_zone": "+0900"
                    }
                }
            }
        }
    }
}
//USER_MK_DT가 2020-01-01 이상인 도큐면트 가져오기