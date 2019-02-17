// Components
// NOTE: always use small letters only
covertitle= {
    template:`
    <div id="covertitle">
        <img class="rellax" :src="image">
        <h1 class="rellax" data-rellax-speed="7" >{{title}}</h1>
    </div>
    `,
    props:['image','title'],
};

badge= {
    // Uses shields.io api
    // template: `
    // <img :src="address"/>
    // `,

    //using bootstrap
    template : `
        <div class="text-center" style="margin: 2px;">
            <b-button :variant="color">
            {{label}}
                <b-badge pill variant="light">{{status}}</b-badge>
            </b-button>
        </div>
    `, 
    props: ["label","status","color"],
    computed : {
        address : function () {
            let base="https://img.shields.io/badge/";
            base+=encodeURIComponent(this.label)+"-";
            base+=encodeURIComponent(this.status)+"-";
            base+=encodeURIComponent(this.color)+".svg";
            return base;
        },
    }
};

loader = {
    template : ` 
    <b-progress style="margin:0px!important;
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:1%;
            z-index:2000;
            border-radius:0;
            "class="mt-2" :max="max">
        <b-progress-bar :value="extendarray[0]" variant="success" />
        <b-progress-bar :value="extendarray[1]" variant="warning" />
        <b-progress-bar :value="extendarray[2]" variant="danger" />
        <b-progress-bar :value="extendarray[3]" variant="info" />
    </b-progress>`,
    props:['percent'],
    data : function(){
        return {
            extendarray : [0,0,0,0],
            max : 100,
            };
    },
    watch : {
        percent : function(newpercent,oldpercent) {
            newpercent=Math.min(Number(newpercent),this.max);
            let division=this.max/this.extendarray.length;
            var arr=[];
            for(let i=0;i<this.extendarray.length;i++)
            {
                if(newpercent>0)
                {
                    if(newpercent>division)
                        arr.push(division);
                    else
                        arr.push(newpercent);
                    newpercent-=arr[arr.length-1];
                }
                else{
                    arr.push(0);
                }
                
            }
            this.extendarray=arr;
        }
    },
    mounted : function() {
        this.percent=this.percent+0.0001;
    }
};
//--------------------------
var vm = new Vue({
    el : "#container",
    components : {
        covertitle,
        badge,
        loader,
    },
    data : {
        title: "Tinkerhub@Campus",
        image: "coverBack.jpg",
        chapters: 5,
        percent: 100,
        downlink: "/",
    },
    methods : {
        down : function() {
            link=this.downlink;
            axios.get(link,{
                onDownloadProgress: function(progressEvent) {
                    this.percent = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                  }
            });
        }
    },
    mounted : function(){
        document.getElementById("fullscreen").style.display="none";
    }
});
var rellax = new Rellax('.rellax');