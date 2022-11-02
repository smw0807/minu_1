const MODIFIER_NAMES = ['swap', 'write', 'fill'];

export class ImmutableBuffer {
  constructor(size, executor) {
    const buffer = Buffer.alloc(size); //1
    console.log('buffer', buffer);
    const modifiers = {}; //2
    //3
    for (const prop in buffer) {
      console.log(buffer[prop]);
      if (typeof buffer[prop] !== 'function') {
        continue;
      }
      //4
      if (MODIFIER_NAMES.some(m => prop.startsWith(m))) {
        modifiers[prop] = buffer[prop].bind(buffer);
      } else {
        //5
        this[prop] = buffer[prop].bind(buffer);
      }
    }
    executor(modifiers); //6
  }
}
