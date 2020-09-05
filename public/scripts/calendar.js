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
      type: "empty"
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
      type: "empty"
      }
    }
    return obj
}
export function splitFunction(e, i, a){
    let d = o.dauer
    let duration = moment.duration(moment(e.end).diff(moment(e.start))).asMinutes()
    let x = Math.floor(duration/d)
    let array = []
    for (let index = 0; index < x; index++) {
      let obj = {
        name: "freier Termin",
        start: moment(e.start).add(index*d, "minutes").format("YYYY-MM-DD HH:mm"),
        end: moment(e.start).add(index*d+d, "minutes").format("YYYY-MM-DD HH:mm"),
        duration: d,
        type: "split",
        color: "green",
        startFormated: moment(e.start).add(index*d, "minutes").format("HH:mm")
      }     
      // Mittagspausen 
      const mittagEnd = moment(obj.start).startOf("day").add(o.mittagStartH, "hours").add(o.mittagStartM, "minutes")
      const mittagStart = moment(obj.start).startOf("day").add(o.mittagEndH, "hours").add(o.mittagEndM, "minutes")
      const day = moment(obj.start).day()
      if (moment(obj.start).isBetween(mittagStart, mittagEnd) || moment(obj.end).isBetween(mittagStart, mittagEnd)) {

      } else if(wochentage.includes(day)) {
        array.push(obj)   
      } else {

      }                           
    }
    return array
  }
export function byEnd(a, b){
    var x = a.end;
    var y = b.end;
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
}

