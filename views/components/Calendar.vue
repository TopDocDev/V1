<template>
    
    Vue.component("calendar", {
  template: `
 <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
        <form>
    <div class="form-row">
        <label for="i.a">Morgen Start</label>
      <div class="col-2">
        <input type="text" class="form-control" placeholder="08:00" v-model="i.a" label="i.a">
      </div>
      <label for="i.b">Morgen Start</label>
      <div class="col-2">
        <input type="text" class="form-control" placeholder="12:00" v-model="i.b" label="i.b">
      </div>
      <label for="i.c">Morgen Start</label>
      <div class="col-2">
        <input type="text" class="form-control" placeholder="13:00" v-model="i.c" label="i.c">
      </div>
      <label for="i.d">Morgen Start</label>
      <div class="col-2">
        <input type="text" class="form-control" placeholder="17:00" v-model="i.d" label="i.d">
      </div>
      <label for="i.e">Morgen Start</label>
      <div class="col-2">
        <input type="text" class="form-control" placeholder="20" v-model="i.e" label="i.e">
      </div>
      <v-btn class="btn btn-primary" v-on:click="makeArray">Kalender berechnen</v-btn>
    </div>
</form>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                outlined
                color="grey darken-2"
                v-bind="attrs"
                v-on="on"
              >
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          :first-interval= 7 
          :interval-minutes= 60
          :interval-count= 11 
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
              <span v-html="selectedEvent.start"></span>
              <span v-html="selectedEvent.end"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
    data: () => ({
      focus: '',
      type: 'week',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: <%- data %>,
      message: "hello",
      i: {
        a: "08:00",
        b: "12:00",
        c: "13:30",
        d: "17:00",
        e: "20"
      }
    }),
    methods: {
      makeArray(){
        let i = this.i
        let o = {
          dayStartH: i.a.slice(0,2),
          dayStartM: i.a.slice(3,5),
          mittagEndH: i.b.slice(0,2),
          mittagEndM: i.b.slice(3,5),
          mittagStartH: i.c.slice(0,2),
          mittagStartM: i.c.slice(3,5),
          dayEndH: i.d.slice(0,2),
          dayEndM: i.d.slice(3,5),
          dauer: i.e,
        }
        for (var prop in o) {
            if (Object.prototype.hasOwnProperty.call(o, prop)) {
              o[prop] = Number(o[prop])
            }
        }

        let oldE = <%- data %>
        // gibt Array mit offenen Zeitfenstern zurück
        let newE = []
        oldE.forEach(function(element, index, array) {
          if (index === 0 || index > oldE.length -2) {
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
        let combined = oldE.concat(newE)
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
          let open = moment(dayStart).add(o.dayStartH, "hours").add(o.dayStartM, "minutes").toString()
          let end = moment(element.end)
          let duration = moment.duration(end.diff(dayStart))
          let hours = duration.asHours()
          let solution = Math.floor((hours-o.dayEndH)/24)
          if(solution === -1 && index < array.length - 1){
            return element
          }
          if(solution === 0 && index < array.length - 1){
            let evening = {
              name: "eve",
              start: element.start,
              end: moment(dayStart).add(o.dayEndH, "hours").add(o.dayEndM, "minutes").format("YYYY-MM-DD HH:mm"),
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
              end: moment(dayStart).add(o.dayEndH, "hours").add(o.dayEndM, "minutes").format("YYYY-MM-DD HH:mm"),
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
                    end: moment(dayStart).add([n+1] * 24 + o.dayEndH, "hours").format("YYYY-MM-DD HH:mm"),
                    color: "orange",
                    open: true,
                }
                arr.push(ganz)
            }
            let morning = {
              name: "Schwanz",
              start: moment(array[index+1].start).startOf("day").add(o.dayStartH, "hours").add(o.dayStartM, "minutes").format("YYYY-MM-DD HH:mm"),
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
        let split = neu.flatMap(function(e, i, a){
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
              open: true,
              color: "green",
              startFormated: moment(e.start).add(index*d, "minutes").format("HH:mm")
            }     
            // Mittagspausen 
            const mittagEnd = moment(obj.start).startOf("day").add(o.mittagStartH, "hours").add(o.mittagStartM, "minutes")
            const mittagStart = moment(obj.start).startOf("day").add(o.mittagEndH, "hours").add(o.mittagEndM, "minutes")
            if (moment(obj.start).isBetween(mittagStart, mittagEnd) || moment(obj.end).isBetween(mittagStart, mittagEnd)) {
            } else {
              array.push(obj)   
            }                           
          }
          return array
        })
        this.events = split.concat(oldE)
        return this.events
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
    }
})

let app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
})

}
</script>

<style>

</style>
