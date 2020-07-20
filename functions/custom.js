const moment = require("moment")
const sql = require("mssql")

const dbConfig = {  
  server: 'localhost', 
  database: "v21db",
  authentication: {
      type: 'default',
      options: {
          userName: 'louis', 
          password: 'password'  
      }
  },
}; 
module.exports.getDb = () => {
  return new Promise((resolve, reject) => {
    var conn = new sql.ConnectionPool(dbConfig);  // create sql instance
    var req = new sql.Request(conn);
    conn.connect(function (err){
      if (err) {
          console.log(err);
          return;
      }
      let a = {
          number: 1000,
          date: "07/20/2020",
      }
      const text = "SELECT TOP "+ a.number + "TT_PNAME as name, TT_DATAUS as 'end', DATEADD(MINUTE, -TT_DAUER, TT_DATAUS) AS start, 'green' as color from v21db.dbo.vm97$ where TT_DATAUS > '" + a.date +"' and TT_PNR is not null order by TT_DATAUS"
      req.query(text, function (err, myobject){
        
        let arr = JSON.parse(JSON.stringify(myobject.recordset));
        let newArr = arr.map(e => ({
            name: e.name,
            start: moment(e.start).utc().format("YYYY-MM-DD HH:mm"),
            end: moment(e.end).utc().format("YYYY-MM-DD HH:mm"),
            color: "yellow",
            duration: moment.duration(moment(e.end).diff(moment(e.start))).asMinutes(),
            open: false,               
        }))
        console.log(arr)
        console.log(newArr)
        
        // let split = custom.makeArray(newArr)
        resolve(newArr)
      });
    });   
  })
}
function makeArray(oldE) {
    let y = oldE.map(e => ({
        name: e.name,
        start: moment(e.start).format("YYYY-MM-DD HH:mm"),
        end: moment(e.end).format("YYYY-MM-DD HH:mm"),
        color: "yellow",
        duration: moment.duration(moment(e.end).diff(moment(e.start))).asMinutes(),
        open: false,               
    }))
    let newE = []
    y.forEach(function(element, index, array) {
      if (index === 0 || index > y.length -2) {
        return
      } else {
        let emptyStart = moment(array[index].end)
        let emptyEnd  = moment(array[index+1].start)
        let duration = moment.duration(emptyEnd.diff(emptyStart));
        let minutes = duration.asMinutes()
        let obj = {
          name: "frei",
          start: emptyStart.format("YYYY-MM-DD HH:mm"),
          end: emptyEnd.format("YYYY-MM-DD HH:mm"),
          color: "green",
          duration: minutes,
          open: true,
          prevStart: element.start,
        }
        if(minutes > 5){              
          newE.push(obj)
        }
        else{
          return
        }

      }
    })
    let combined = y.concat(newE)
    combined.sort(function(a, b){
      var x = a.end;
      var y = b.end;
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    })
    newE.sort(function(a, b){
      var x = a.end;
      var y = b.end;
      if (x < y) {return -1;}
      if (x > y) {return 1;}
      return 0;
    })
    // schneidet Zeitfenster-Array auf Öffnungszeiten
    let cut = combined.flatMap(function (element, index, array, n){
      let dayStart = moment(element.start).startOf("day").toString()
      let open = moment(dayStart).add(8, "hours").toString()
      let end = moment(element.end)
      let duration = moment.duration(end.diff(dayStart))
      let hours = duration.asHours()
      let solution = Math.floor((hours-17)/24)
      if(solution === -1 && index < array.length - 1){
        return element
      }
      if(solution === 0 && index < array.length - 1){
        let evening = {
          name: "eve",
          start: element.start,
          end: moment(dayStart).add(17, "hours").format("YYYY-MM-DD HH:mm"),
          color: "red",
          open: true,
        }       
        evening["duration"] = moment.duration(moment(evening.end).diff(moment(evening.start))).asMinutes()     
        let morning = {
          name: "1. Termin",
          start: moment(open).add(24, "hours").format("YYYY-MM-DD HH:mm"),
          end: array[index+1].start,
          color: "green",
          open: true,
        }
        if(evening.duration > 5){
          return [morning,evening]
        }
        else {
          return morning
        }
        
      }
      if(solution > 0 && index < array.length - 1){
        let arr = []
        let evening = {
          name: "eve",
          start: element.start,
          end: moment(dayStart).add(17, "hours").format("YYYY-MM-DD HH:mm"),
          color: "red",
          open: true,
        }
        evening["duration"] = moment.duration(moment(evening.end).diff(moment(evening.start))).asMinutes()            
        if(evening.duration > 5){
          arr.push(evening)
        }
        for(n = 0; n < solution; n++){
            let ganz = {
                name: "ganz",
                start: moment(open).add([n+1] * 24, "hours").format("YYYY-MM-DD HH:mm"),
                end: moment(dayStart).add([n+1] * 24 + 17, "hours").format("YYYY-MM-DD HH:mm"),
                color: "orange",
                open: true,
            }
            arr.push(ganz)
        }
        let morning = {
          name: "Schwanz",
          start: moment(array[index+1].start).startOf("day").add(8, "hours").format("YYYY-MM-DD HH:mm"),
          end: array[index+1].start,
          color: "pink",
          open: true,
        }
        arr.push(morning)
        return arr
      }
      else {
        return element
      }
    })
    let neu = cut.filter(function(e){
      return e.open === true
    })
    let d = 20
    let split = neu.flatMap(function(e, i, a){
      let duration = moment.duration(moment(e.end).diff(moment(e.start))).asMinutes()
      let x = Math.floor(duration/d)
      let array = []
      for (let index = 0; index < x; index++) {
        let obj = {
          name: "split",
          start: moment(e.start).add(index*d, "minutes").format("YYYY-MM-DD HH:mm"),
          end: moment(e.start).add(index*d+d, "minutes").format("YYYY-MM-DD HH:mm"),
          duration: d,
          open: true,
          color: "blue",
          startFormated: moment(e.start).add(index*d, "minutes").format("HH:mm")
        }     
        array.push(obj)                  
      }
      return array
    })
    return split
}
function sortByEnd(a, b){
  var x = a.end;
  var y = b.end;
  if (x < y) {return -1;}
  if (x > y) {return 1;}
  return 0;
}
function getFiveDays(input){
  const date = []
  for (let i = 1; i < 6; i++) {
    date.push(moment().add([i]*24, "hours").format("YYYY-MM-DD"))  
  }
  let output = date.map(function(element, index, array){
    let newArr = input.filter(function(e){
      return e.start.startsWith(element)
    })
    return newArr
  })
  return output
}
function makeOrange(e,i,a){
  const obj = {
    name: "Termin auf Website",
    start: e.start,
    end: e.end,
    duration: e.duration,
    open: false,
    color: "orange",
    startFormated: e.startFormated,
    toDb: true
  }
  return obj
}
module.exports.makeOrange = makeOrange;
module.exports.sortByEnd = sortByEnd;
module.exports.makeArray = makeArray;
module.exports.getFiveDays = getFiveDays;
