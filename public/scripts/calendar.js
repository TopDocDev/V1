// gets time in between elements
export function getEmpty(element, index, array) {
    let obj;
    if ((array.length - 1) === index) {
      let emptyStart = moment(array[index].end)
      obj = {
      name: "leztes element",
      start: emptyStart.format("YYYY-MM-DD HH:mm"),
      end: undefined,
      color: "green",
      duration: 20,
      open: true,
      toDb: false
      }
    } else {
      let emptyStart = moment(array[index].end)
      let emptyEnd  = moment(array[index+1].start)
      let duration = moment.duration(emptyEnd.diff(emptyStart));
      let minutes = duration.asMinutes()
      obj = {
      name: "frei",
      start: emptyStart.format("YYYY-MM-DD HH:mm"),
      end: emptyEnd.format("YYYY-MM-DD HH:mm"),
      color: "green",
      duration: minutes,
      open: true,
      toDb: false
      }
    }
    return obj
}
export function byEnd(a, b){
    var x = a.end;
    var y = b.end;
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
}

