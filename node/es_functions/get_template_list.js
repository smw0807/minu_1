//https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#_indices_gettemplate
const es_client = require('./client');


async function run() {
  try {
    const rs = await es_client.indices.getTemplate({
      name: 'tpl_ni_*',
      // name: 'tpl_ni_manage',
      // include_type_name: true,
      // flat_settings: true,
      // master_timeout: string,
      // local: boolean
    })
    console.log(rs);
    // console.dir(rs, {depth: 5});
  } catch (err) {
    console.error(err);
  }
}

run();
/**
1. include_type_name 속성 
매핑 본문에 형식을 반환할지 여부
없을 때
{
  tpl_ni_manage: {
    order: 0,
    index_patterns: [ 'ni_manage*' ],
    settings: { index: [Object] },
    mappings: { dynamic_templates: [Array], properties: [Object] },
    aliases: {}
  }
}
있고 true 일 때
{
  tpl_ni_manage: {
    order: 0,
    index_patterns: [ 'ni_manage*' ],
    settings: { index: [Object] },
    mappings: { _doc: [Object] },
    aliases: {}
  }
}
있고 false 일 때 (없을 때랑 같음)
{
  tpl_ni_manage: {
    order: 0,
    index_patterns: [ 'ni_manage*' ],
    settings: { index: [Object] },
    mappings: { dynamic_templates: [Array], properties: [Object] },
    aliases: {}
  }
}

2. flat_settings (default : false)
플랫 형식으로 설정 반환
true 일 때
{
  tpl_ni_manage: {
    order: 0,
    index_patterns: [ 'ni_manage*' ],
    settings: {
      'index.analysis.normalizer.nm_lower.filter': [Array],
      'index.analysis.normalizer.nm_lower.type': 'custom',
      'index.max_result_window': '20000',
      'index.merge.scheduler.max_thread_count': '1',
      'index.number_of_replicas': '2',
      'index.number_of_shards': '5',
      'index.refresh_interval': '1ms',
      'index.translog.durability': 'async',
      'index.translog.flush_threshold_size': '1gb',
      'index.unassigned.node_left.delayed_timeout': '2628000m'
    },
    mappings: { dynamic_templates: [Array], properties: [Object] },
    aliases: {}
  }
}
해당 템플릿에 설정된 인덱스 셋팅 정보 나옴
 */