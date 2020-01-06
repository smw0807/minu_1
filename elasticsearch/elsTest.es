GET /user/_search
{
    "query": {
        "match_all": {}
    }
}

POST /user/_doc/smw0807
{
    "USER_ID": "smw0807",
    "USER_NM": "송민우",
    "USER_PW": "alsdn12",
    "USER_EMAIL": "smw0807@gmail.com",
    "USER_TEL": null,
    "USER_HP": "010-7777-2596",
    "USER_MK_DT": "2020-01-06 22:06:15+0900",
    "IS_USE": true
}