/* /src/index.js */

const msg = 'Hello Rollup';

const foo = x => x + 2;

console.log(msg);

foo(2);

class Super {
    constructor(){
        this.author = 'Yang lin';
        this.version = '1.0.0';
    }

    sayAuhtor(){
        console.log(this.author);
    }

    delay(times){
        return new Promise(resolve => {
            const timer = setTimeout(() => {
                resolve();
            },times);
        });
    }

    update(version){
        this.version = version;
    }
}

export default Super;