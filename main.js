// Components
// NOTE: always use small letters only
covertitle= {
    template:`
    <div class="covertitle">
        <img :src="image">
        <h1>{{title}}</h1>
    </div>
    `,
    props:['image','title'],
};

badge= {
    // Uses shields.io api
    // template: `
    // <img :to="to" :src="address"/>
    // `,

    //using bootstrap
    // template : `
    //     <div class="text-center" style="margin: 2px;">
    //         <b-button :to="to" :variant="color">
    //         {{label}}
    //             <b-badge pill variant="light">{{status}}</b-badge>
    //         </b-button>
    //     </div>
    // `,
    template:`
    <div>
    <span class="light" style="font-size:200%;">{{label}}</span>
    <b-badge variant="light" style="font-size:200%">{{Math.floor(Number(status)/10)}}</b-badge>
    <b-badge variant="light" style="font-size:200%">{{Number(status)%10}}</b-badge>
    </div>
    ` ,
    props: ["label","status","color","to"],
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
            z-index:6000;
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

function displayLoader(){
    if(!window.done)
        document.getElementById("fullscreen").style.display="block";
}

para={
    template:`
    <div class="row" style="margin-top:64px;margin-bottom:16px;">
        <b-col md="5" v-if="(left&&image)">
            <b-card-img :src="image" class="rounded-0" />
        </b-col>
        <b-col :md="(image)?7:12">
            <b-card-body :title="title">
            <b-card-text>
            <slot></slot>
            </b-card-text>
            </b-card-body>
        </b-col>
        <b-col md="5" v-if="(!left&&image)">
            <b-card-img :src="image" class="rounded-0" />
        </b-col>
    </div>`,
    props : ["title","left","image"],
}
accordion={
    template:`
    <div>
        <div class="row">
        <b-button style='border-radius:0px;'
        variant="success" 
        class="col-sm-12" 
        @click="toggle=!toggle" 
        :aria-expanded="toggle ? 'true' : 'false'"
        >
        {{title}}
        </b-button>
        </div>
        <div class="row">
                <b-collapse :id='id' v-model="toggle">
                <b-container>
                    <b-row>
                        <b-col md="5" v-if="(left&&image)">
                            <b-card-img :src="image" class="rounded-0" />
                        </b-col>
                        <b-col :md="(image)?7:12">
                            <b-card-body>
                            <b-card-text>
                            <slot></slot>
                            </b-card-text>
                            </b-card-body>
                        </b-col>
                        <b-col md="5" v-if="(!left&&image)">
                            <b-card-img :src="image" class="rounded-0" />
                        </b-col>
                    </b-row>
                </b-container>
                </b-collapse>
        </div>
    </div>`,
    props:['id','title','left','image'],
    data(){
        return {
            toggle:false,
        }
    }
}

chaptercards={
    template:`
    <b-row style="margin:16px;">
        <router-link class="col-md-12" style="width:auto;padding-left:0px;padding-right:0px;":to="(website)?('/chapters/'+website):'/chapters/'">
        <b-container style="color:black;border-radius: 8px;box-shadow:0px 0px 15px 2px #ccc;padding:0px;" >
            <b-row style="margin:0px;">
                <img class="col-md-3" :src="img" style="border-radius:8px;padding:0px;">
                <b-col md='1'></b-col>
                <b-col md="8">
                    <h2>{{title}}</h2>
                    <p>{{desc}}</p>
                    
                </b-col>
            </b-row>
        </b-container>
        </router-link>
    </b-row>`,
    props:['title','desc','website','img','imgalt','lead']
}

chapterP=async function(){
    id=vm.$route.params.id;
    a=await axios.get("./Chapters/"+id);
    return {
        template:a.data,
        components:{
            covertitle,
            para,
        },
        props:['who'],
    }
}
function asyncComponentFactory(p){
    return p;
//     return {
//         component: p,
//   // A component to use while the async component is loading
//         loading: LoadingComponent,
//   // A component to use if the load fails
//         // error: ErrorComponent,
//   // Delay before showing the loading component. Default: 200ms.
//         delay: 200,
//   // The error component will be displayed if a timeout is
//   // provided and exceeded. Default: Infinity.
//         timeout: 3000
//     }
};
// The index page
mainV = asyncComponentFactory( async function(){
    try {vm.percent=0;}catch(e){;}
    window.done=false;
    setTimeout(displayLoader(),200);
    a=await axios.get("./main.html",{
        onDownloadProgress(e){
            vm.percent=(e.loaded/e.total)*100;
        }
    });
    return {
    template: a.data,
    components:{
        covertitle,
        badge,
        para,
    },
    data: function(){
        return {
            title: "Tinkerhub@Campus",
            image: "coverBack.jpg",
        }
    },
    mounted : function() {
        iframes=document.getElementsByClassName('embed-responsive-item');
        for(i=0;i<iframes.length;i++)
        {
            if(iframes[i].src=="")
            iframes[i].src=iframes[i].dataset["src"];
        }
        window.done=true;
        document.getElementById("fullscreen").style.display="none";
    }
    }
});

chapterV=asyncComponentFactory( async function(){
    try {vm.percent=0;}catch(e){;}
    window.done=false;
    setTimeout(displayLoader(),200);
    a=await axios.get("./Chapters/index.html",{
        onDownloadProgress(e){
            vm.percent=(e.loaded/e.total)*50;
        }
    });
    chapters=await axios.get('./Chapters/chapters.json',{
        onDownloadProgress(e){
            vm.percent=50+(e.loaded/e.total)*50;
        }
    });
    return {
        template: a.data,
        components : {
            covertitle,
            para,
            chaptercards,
            chapterP,
        },
        data : function(){
            return {
                'chapters':chapters.data,
            }
        },
        mounted() {
            window.done=true;
            document.getElementById("fullscreen").style.display="none";
        }
    };
    
});

handbookV=asyncComponentFactory( async function() {
    try {vm.percent=0;}catch(e){;}
        
    window.done=false;
    setTimeout(displayLoader(),200);
    a=await axios.get("./handbook/index.html",{
        onDownloadProgress(e){
            vm.percent=(e.loaded/e.total)*100;
        }
    });
    
    return {
        template: a.data,
        components : {
            covertitle,
            para,
            accordion,
        },
        mounted() {
            window.done=true;
            document.getElementById("fullscreen").style.display="none";
        }
    };
});
//--------------------------
var router=new VueRouter({
    routes: [
        {path:'/',component:mainV},
        {path:'/chapters',component:chapterV},
        {path:'/chapters/:id',component:chapterV},
        {path:'/handbook',component:handbookV},
    ],
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
          return savedPosition
        } else {
          return { x: 0, y: 0 }
        }
      }
})
var vm = new Vue({
    el : "#container",
    router,
    components : {
        covertitle,
        badge,
        loader,
        mainV,
    },
    data : {
        title: "Tinkerhub@Campus",
        image: "coverBack.jpg",
        chapters: 2,
        percent: 100,
    },
});
window.onload=function(){
    document.getElementById("fullscreen").style.display="none";
}