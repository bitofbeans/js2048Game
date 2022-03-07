class ball {
    constructor(value) {
        this.val = value    
    }

    set(value) {
        this.val = value
    }
}

array = [new ball(0),new ball(1),new ball(2),new ball(3)]

Ball1 = array[0]
Ball1.set("New")

console.log(array[0].val);