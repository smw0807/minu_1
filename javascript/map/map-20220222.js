let map = new Map();
map.set('1', 'a');
map.set('2', 'b');
map.set('3', 'c');

console.log(map);
console.log(map.get('1'));
console.log(map.keys());
console.log(map.entries());

/**
Map(3) { '1' => 'a', '2' => 'b', '3' => 'c' }
a
[Map Iterator] { '1', '2', '3' }
[Map Entries] { [ '1', 'a' ], [ '2', 'b' ], [ '3', 'c' ] }
 */