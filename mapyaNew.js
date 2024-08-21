let mapObj = {
    arData: [],
    map: null,
    shapArrAll: [],
    linkDiv: [],
    linkCluster: [],
    linkCity: [],
    wave: null,
    curUrl: null,
};

mapObj.getData = function(url1) {
    var req;
    mapObj.curUrl = url1;
    //wave = document.getElementById('id_wave').value;
    url =  url1;
    if (window.XMLHttpRequest) {
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    req.onreadystatechange = function(){
        if (req.readyState == 4) {
            dat = req.responseText;
            var iObject = JSON.parse(dat);
            
            mapObj.inObject = iObject.data;
            mapObj.inType = iObject.type;
            console.log(mapObj.inType);
            mapObj.backLink = iObject.backLink;
            console.log("Тест обратной ссылки = ", iObject.user_right);
            mapObj.parseData();
            mapObj.initMap();
            mapObj.createMap();
            
        }
    };
    req.open("GET", url, true);
    req.send();
}

mapObj.initMap = function() {	
        console.log("Включение кнопки назад - ", mapObj.inType);
        let backButton = document.getElementById('linkback99');
        
	document.getElementById('linkback99').style.display = (mapObj.inType !== 'div') ? "block" : "none";
        console.log("Включение кнопки назад - ", document.getElementById('linkback99').style.display);
	this.zoom = 10;

	document.getElementById('data003').style.display = "";
//	document.getElementById('data004').style.display = "none";
	document.getElementById('data003').style.Overflow = "auto";
	document.getElementById('ptbl').innerHTML = '';
	
	document.getElementById('navi').style.display = "none";
	if (mapObj.inType == 'div'){
                let flag = 'div';
		document.getElementById('navi').style.display = "";
		document.getElementById('navi').innerHTML = "<span onClick='mapObj.navClick(\"div\"); return false;'>Россия</span>";
	} else if (mapObj.inType == 'cluster') {
                let flag = 'div';
		document.getElementById('navi').style.display = "";
		document.getElementById('navi').innerHTML = "<span onClick='mapObj.navClick(\"div\"); return false;'>Россия</span> > "+
													"<span onClick='mapObj.navClick(\"div\"); return false;'>"+this.linkDiv['nme']+"</span>";
	} else if (mapObj.inType == 'cities') {
                let flag = 'div';
		document.getElementById('navi').style.display = "";
		document.getElementById('navi').innerHTML = "<span onClick='mapObj.navClick(\"div\"); return false;'>Россия</span> > "+
													"<span onClick='mapObj.navClick(\""+this.linkDiv['url']+"\"); return false;'>"+this.linkDiv['nme']+"</span> > "+
													"<span onClick='mapObj.navClick(\""+this.linkCluster['url']+"\"); return false;'>"+this.linkCluster['nme']+"</span>";
	} else if (mapObj.inType == 'shops') {
		document.getElementById('navi').style.display = "";
		document.getElementById('navi').innerHTML = "<span onClick='mapObj.navClick(\"/ajax/xmap/?\"); return false;'>Россия</span> > "+
													"<span onClick='mapObj.navClick(\""+this.linkDiv['url']+"\"); return false;'>"+this.linkDiv['nme']+"</span> > "+
													"<span onClick='mapObj.navClick(\""+this.linkCluster['url']+"\"); return false;'>"+this.linkCluster['nme']+"</span>"/*+
													"<span onClick='mapObj.navClick(\""+this.linkCity['url']+"\"); return false;'>"+this.linkCity['nme']+"</span>";	*/
	}	

	elem = document.createElement('tr');
	tr  = document.getElementById('ptbl').appendChild(elem);
	if (mapObj.inType == 'div') {
    	tName = "Предприятия";
	} else if (mapObj.inType == 'cluster') {
    	tName = "Точки";
	} else if (mapObj.inType == 'cities') {
    	tName = "Города";
	} else {
    	tName = "Магазины";
	}
	
	let n = document.getElementById("id_map_wave").options.selectedIndex;
	let $m1 = document.getElementById("id_map_wave").options[n].text.split(" ",1);
	let $m2 = (document.getElementById("id_map_wave").options[n+1]) ? document.getElementById("id_map_wave").options[n+1].text.split(" ",1) : "-";

//        let n = 14;
//        var $m1 = 14;
//        var $m2 = 14;
        
        
	st1 = document.createElement('td'); st1.setAttribute('style', 'font:13px LatoWeb; color:#455d7a; font-weight:bold'); st1.innerHTML = tName; 
	td2 = document.createElement('td'); td2.setAttribute('style', 'padding:5px; width:30px;'); td2.innerHTML = $m1;
	td3 = document.createElement('td'); td3.setAttribute('style', 'padding:5px; width:30px;'); td3.innerHTML = $m2;
	td4 = document.createElement('td'); td4.setAttribute('style', 'padding:5px; width:30px;'); td4.innerHTML = "Дельта";
	tr.appendChild(st1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	tr.appendChild(td4);
        console.log("force click = ", mapObj.inType == 'div');
	for(i=0; i<this.arData.length; i++){
		elem = document.createElement('tr');
		tr  = document.getElementById('ptbl').appendChild(elem);
		st1 = document.createElement('td'); 
		st1.setAttribute('style', 'text-align:left; padding-left:10px;'); 
//		st1.innerHTML = "<a class='test' href='' onMouseOver='mapObj.emMarkerEnter("+i+")' onMouseOut='mapObj.emMarkerLeave("+i+")' onClick='mapObj.forceClick("+i+"); return false;'>"+this.arData[i].name+this.arData[i].adr+"</a>"; 
                st1.innerHTML = "<a class='test' href='' onMouseOver='mapObj.emMarkerEnter("+i+")' onMouseOut='mapObj.emMarkerLeave("+i+")'>"+this.arData[i].name+this.arData[i].adr+"</a>"; 
                if (mapObj.inType == 'div') {
                    st1.firstElementChild.setAttribute('onClick','mapObj.forceClick("'+i+'");');
                } else {
                    st1.firstElementChild.setAttribute('onClick','event.preventDefault();');
                }
                
		if (this.arData[i].tt == 0) {
                        var colr = "#AAAAAA";
                } else if (this.arData[i].tt.toFixed(2) < 80){
                        var colr = "#FF0000";
                } else if (this.arData[i].tt.toFixed(2) < 95){
                        var colr = "#FF9900";
                } else {
                        var colr = "#008000";
                }

                if (this.arData[i].tt2 == 0) {
                        var colr2 = "#AAAAAA";
                } else if (this.arData[i].tt2.toFixed(2) < 80){
                        var colr2 = "#FF0000";
                } else if (this.arData[i].tt2.toFixed(2) < 95){
                        var colr2 = "#FF9900";
                } else {
                        var colr2 = "#008000";
                }

		td2 = document.createElement('td'); 
			td2.setAttribute('style', 'padding:5px; color:'+colr+';'); 
			if (this.arData[i].tt > 0) {
				td2.innerHTML = this.arData[i].tt.toFixed(2);
			} else {
				td2.innerHTML = '-';
			}
		td3 = document.createElement('td'); 
			td3.setAttribute('style', 'padding:5px; color:'+colr2+';'); 
			if (this.arData[i].tt2 > 0) {
				td3.innerHTML = this.arData[i].tt2.toFixed(2);
			} else {
				td3.innerHTML = '-';
			}
		
		td4 = document.createElement('td'); 
			var delta = (this.arData[i].tt - this.arData[i].tt2).toFixed(2);
			if (delta < 0) {
				var dcolr = "#FF0000";
			} else {
				var dcolr = "#008800";
			}
			td4.setAttribute('style', 'padding:5px; color:'+dcolr+';'); 
			if (this.arData[i].tt > 0 && this.arData[i].tt2 > 0) {
				td4.innerHTML = delta;
			} else {
				td4.innerHTML = '-';
			}			
		tr.appendChild(st1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);
	}
	document.getElementById('cnttask1').innerHTML = this.chkcnt;
	rightHeight = document.getElementById('data003').offsetHeight;
	log = (rightHeight > 510) ? rightHeight : 510;
	document.getElementById('mapsYandexSVG').style.height = ''+log+'px';
};

mapObj.parseData = function(){
	this.arData=[];
	this.chkcnt = 0; var icnt = 0
	this.cntt = 0; var itt = 0
	for (i=0; i<this.inObject.length; i++){
		x = this.inObject[i];	
		itt = (x.tt) ? parseFloat( x.tt ) : 0;
		itt2 = (x.tt2) ? parseFloat( x.tt2 ) : 0;
		this.cntt = this.cntt + itt;
		icnt = (x.cnt) ? parseFloat( x.cnt ) : 0;
		this.chkcnt = this.chkcnt + icnt;
//                console.log("x type = ", x.type);
		if (x.type) {
			var itype = (x.type == 1) ? "АЗК" : "АЗС"; 
		}
//                console.log("x name = ", x.name);
                x.sap_id = x.shop_id;
		this.arData.push({
			id   : parseInt( x.id ),
			lng  : parseFloat( x.lng ),
			lat  : parseFloat( x.lat ),
			tt   : itt,
			tt2   : itt2,
			ccnt : icnt,
			type: ((itype) ? itype : ""),
			name : (this.inType != "div") ? ((itype) ? itype+" " : "") + x.sap_id : x.name,
			adr : (this.inType != "div") ? ", "+x.name : "",
			brand: (x.brand) ? x.brand : 0,
			shop_id : x.shop_id,
//			sap_id : (x.sap_id) ? ((itype) ? itype+" " : "")+' № '+x.sap_id+ ' ' : '',
                        sap_id : x.shop_id,
		});
	}
	this.cntt = this.cntt/this.inObject.length;
};

mapObj.calcCenter = function() {
	//console.log('calcCenter')
	var row,arData = this.arData;
	var l,_l=['lat','lng'];
	var min,max,x,c,i,ii;
	for (i in _l) {
		l=_l[i];
		max=0;min=3600000000;
		for (ii in arData) {
			x=arData[ii][l]*10000000;
			if (min>x) min=x;
			if (max<x) max=x;
		}
		c=(min+(max-min)/2)/10000000;
		this['home_'+l]=c;
	}
};

mapObj.createMap = function() {
	this.calcCenter();
	if(this.inType == 'div') {
		this.zoom = 3;	
	} else if (this.inType == 'cluster') {
		this.zoom = 4;	
	} else if (this.inType == 'cities') {
		this.zoom = 5;	
	} else if (this.inType == 'shops') {
		this.zoom = 10;	
	} else if (this.inType == 'shop') {
		this.zoom = 15;	
	}
	this.map = new ymaps.Map("mapsYandexSVG", {
		center: [this.home_lat, this.home_lng],
		zoom: this.zoom,
		controls: ['zoomControl']
	});

	this.map.controls.remove('trafficControl');

	var i; 
	for (i=0;i<this.arData.length;i++){
		if (this.arData[i].lat && this.arData[i].lng) {
			this.arData[i].marker = this.iplaceMarker([this.arData[i].lat , this.arData[i].lng], i);
		}
	}

};

mapObj.iplaceShap = function(latLng, id) {

	if (this.arData[id].tt == 0) {
		var colr = "#AAAAAA";
	} else if (this.arData[id].tt.toFixed(2) < 70) {
		var colr = "#FF0000";
	} else if (this.arData[id].tt.toFixed(2) < 80){
		var colr = "#0070C0";
	} else if (this.arData[id].tt.toFixed(2) < 90){
		var colr = "#008000";
	} else {
		var colr = "#FF9900";
	}
	this.arData[id].colr = colr;
    // Создаем многоугольник, используя класс GeoObject.
    var myShap = new ymaps.GeoObject({
        // Описываем геометрию геообъекта.
        geometry: {
            // Тип геометрии - "Многоугольник".
            type: "Polygon",
            // Указываем координаты вершин многоугольника.
            coordinates: latLng,
            // Задаем правило заливки внутренних контуров по алгоритму "nonZero".
            fillRule: "nonZero"
        },
        // Описываем свойства геообъекта.
        properties:{
            // Содержимое балуна.
            // balloonContent: "Многоугольник"
        	hintContent: 'Дивизион: '+this.arData[id].name+': '+this.arData[id].tt
        }
    }, {
        // Описываем опции геообъекта.
        // Цвет заливки.
        fillColor: colr+'99',
        // Цвет обводки.
        strokeColor: colr+'99',
        // Общая прозрачность (как для заливки, так и для обводки).
        opacity: 1,
        // Ширина обводки.
        strokeWidth: 1,
        // Стиль обводки.
        //strokeStyle: 'shortdash'
    });

	myShap.events.add('click', function(e) {
		mapObj.markerClick(e);
	});
	myShap.events.add('mouseenter', function(e) {
		myShap.options.set({fillColor: colr+'FF'});
		mapObj.markerEnter(e);
	});
	myShap.events.add('mouseleave', function(e) {
		myShap.options.set({fillColor: colr+'99'});
		mapObj.markerLeave(e);
	});

    // Добавляем многоугольник на карту.
    this.map.geoObjects.add(myShap);

	if (id !== false) {myShap.arrayId = id;}
	return myShap;
};

mapObj.iplaceMarker = function(latLng, id) {

	if (this.arData[id].tt == 0) {
		var colr = "#AAAAAA";
	} else if (this.arData[id].tt.toFixed(2) < 80){
		var colr = "#FF0000";
	} else if (this.arData[id].tt.toFixed(2) < 95){
		var colr = "#FF9900";
	} else {
		var colr = "#008000";
	}
	this.arData[id].colr = colr;

	if(1 || mapObj.inType == "div"){
		var marker = new ymaps.Placemark(latLng, {}, {
			draggable: false,
			iconColor: colr,
			preset: 'islands#dotIcon',
		});
	} else {
		
		var marker = new ymaps.Placemark(latLng, {}, {
			draggable: false,
			iconColor: colr,
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: '../web/main/images/comb/'+mapObj.arData[id].brand+'.png',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38]
		});
	}

	marker.events.add('click', function(e) {
		if(mapObj.inType=="cluster"){
			getChk(mapObj.arData[id].shop_id);
		} else {
		 	mapObj.markerClick(e);
		}
	});
	marker.events.add('mouseenter', function(e) {
		marker.options.set({iconColor: colr, preset: 'islands#greenDotIconWithCaption'});
		marker.properties.set({iconCaption: mapObj.arData[id].name});
		mapObj.markerEnter(e);
	});
	marker.events.add('mouseleave', function(e) {
		marker.options.set({iconColor: colr, preset: 'islands#dotIcon'});
		mapObj.markerLeave(e);

	});

	this.map.geoObjects.add(marker);

	if (id !== false) {marker.arrayId = id;}
	return marker;
};


/* FUNCTION *******************************************************************/

mapObj.markerClick = function(e){
	var id = e.originalEvent.target.arrayId;
//        console.log("Выбранное id = ", id);
	if (mapObj.inType == 'cluster') {mapObj.shopOpen(mapObj.arData[id].shop_id); return;}
	//if (mapObj.inType == 'cluster') {return;}
	if (mapObj.inType == 'shops') {mapObj.shopOpen(mapObj.arData[id].shop_id); return;}
	divPath = (this.linkDiv['id']) ? '&divid='+this.linkDiv['id'] : '';
	clusterPath = (this.linkCluster['id']) ? '&clusterid='+this.linkCluster['id'] : '';
//	var link = '/ajax/xmap/?type='+mapObj.inType+'&id='+this.arData[id].id+divPath+clusterPath;
        let n = document.getElementById("id_map_wave").options.selectedIndex;
        let wave = document.getElementById('id_map_wave').value;
        let wavePrevous = (document.getElementById("id_map_wave").options[n-1]) ? document.getElementById("id_wave").options[n-1].value: null;
        let url = new URL(window.location.href);
        url.pathname = "/ajax/yMap/";
        url.searchParams.set('type', mapObj.inType);
        url.searchParams.append('id', mapObj.arData[id].id);
        url.searchParams.append('wave', wave);
        url.searchParams.append('wavePr', wavePrevous);
        console.log("Ссылка с маркера = ", url.toString());
	if (mapObj.inType == 'div') {
		this.linkDiv['url'] = url;
		this.linkDiv['nme'] = this.arData[id].name;
		this.linkDiv['id'] = this.arData[id].id;
		this.linkCluster = [];
		this.linkCity = [];
	} else if (mapObj.inType == 'cluster') {
		this.linkCluster['url'] = url;
		this.linkCluster['nme'] = this.arData[id].name;
		this.linkCluster['id'] = this.arData[id].id;
		this.linkCity = [];
	} else if (mapObj.inType == 'cities') {
		this.linkCity['url'] = url;
		this.linkCity['nme'] = this.arData[id].name;
	}	
	document.getElementById('mapsYandexSVG').innerHTML = '';
	mapObj.map = null;
	mapObj.inObject = {};
	mapObj.inType = {};
	mapObj.getData(url);
};

mapObj.forceClick = function(id){
        event.preventDefault();
        console.log("id на вывод анкеты = ", mapObj.arData[id].id);
	if (mapObj.inType == 'cluster') {
            console.log("id на вывод анкеты = ", mapObj.arData[id].shop_id);
            mapObj.shopOpen(mapObj.arData[id].shop_id); 
            return;
        }
        let n = document.getElementById("id_map_wave").options.selectedIndex;
        let wave = document.getElementById('id_map_wave').value;
        let wavePrevous = (document.getElementById("id_map_wave").options[n-1]) ? document.getElementById("id_wave").options[n-1].value: null;
//	if (mapObj.inType == 'shops') {mapObj.shopOpen(mapObj.arData[id].shop_id); return;}
//	if (mapObj.inType == 'cluster') {return;}
	divPath = (this.linkDiv['id']) ? '&divid='+this.linkDiv['id'] : '';
	clusterPath = (this.linkCluster['id']) ? '&clusterid='+this.linkCluster['id'] : '';
//	var link = '/ajax/xmap/?type='+mapObj.inType+'&id='+this.arData[id].id+divPath+clusterPath;
        let url = new URL(window.location.href);
        url.pathname = "/ajax/yMap/";
//        let url = new URL('http://localhost/RN2019_Clone/query.php');
        url.searchParams.set('type', mapObj.inType);
        url.searchParams.append('id', mapObj.arData[id].id);
        url.searchParams.append('wave', wave);
        url.searchParams.append('wavePr', wavePrevous);
	if (mapObj.inType == 'div'){
		this.linkDiv['url'] = url;
		this.linkDiv['nme'] = this.arData[id].name;
		this.linkDiv['id'] = this.arData[id].id;
		this.linkCluster = [];
		this.linkCity = [];
	} else if (mapObj.inType == 'cluster') {
		this.linkCluster['url'] = url;
		this.linkCluster['nme'] = this.arData[id].name;
		this.linkCluster['id'] = this.arData[id].id;
		this.linkCity = [];
	} else if (mapObj.inType == 'cities') {
		this.linkCity['url'] = url;
		this.linkCity['nme'] = this.arData[id].name;
	}	
	document.getElementById('mapsYandexSVG').innerHTML = '';
	mapObj.map = null;
	mapObj.inObject = {};
	mapObj.inType = {};
	mapObj.getData(url);
};

mapObj.navClick = function(link){
	document.getElementById('mapsYandexSVG').innerHTML = '';
	if (mapObj.inType == 'div'){
		this.linkCluster = [];
		this.linkCity = [];
	} else if (mapObj.inType == 'cluster') {
		this.linkCity = [];
	}	
        url = (link == 'div') ? new URL(mapObj.backLink): link; 
	console.log('navClick: '+url);
        let n = document.getElementById("id_map_wave").options.selectedIndex;
        let wave = document.getElementById('id_map_wave').value;
        let wavePrevous = (document.getElementById("id_map_wave").options[n-1]) ? document.getElementById("id_map_wave").options[n-1].value: null;
        //let link1 = new URL(link);
        url.searchParams.set('wave', wave);
        url.searchParams.set('wavePr', wavePrevous);
        console.log('navClick: ', url.toString());
        mapObj.map = null;
	mapObj.inObject = {};
	mapObj.inType = {};
	mapObj.getData(url);
};

mapObj.chgWave = function(){
	document.getElementById('mapsYandexSVG').innerHTML = '';
	mapObj.map = null;
	mapObj.inObject = {};
	mapObj.inType = {};
	mapObj.getData(this.curUrl);
};

mapObj.markerEnter = function(e){

	var id = e.originalEvent.target.arrayId;
	if (mapObj.inType == 'div' || mapObj.inType == 'cluster') {
		return;
	}

};

mapObj.markerLeave = function(e){
	var id = e.originalEvent.target.arrayId;
	e.originalEvent.target.properties.set({iconCaption: null});
	if (mapObj.inType == 'div' || mapObj.inType == 'cluster') {
		return;
	}
};

mapObj.emMarkerEnter = function(id){
/*
  var event = new Event("mouseenter");
  mapObj.arData[id].marker. dispatchEvent(event);
*/
	this.arData[id].marker.options.set({fillColor: mapObj.arData[id].colr+'FF'});
	this.arData[id].marker.options.set({iconColor: mapObj.arData[id].colr, preset: 'islands#greenDotIconWithCaption'});
	this.arData[id].marker.properties.set({iconCaption: mapObj.arData[id].name});
};

mapObj.emMarkerLeave = function(id){
	this.arData[id].marker.options.set({fillColor: mapObj.arData[id].colr+'99'});
	this.arData[id].marker.options.set({iconColor: mapObj.arData[id].colr, preset: 'islands#dotIcon'});
		this.arData[id].marker.properties.set({iconCaption: null});
};


//mapObj.createMap = function() {
//    this.map = new ymaps.Map("mapsYandexSVG", {
//		center: [this.home_lat, this.home_lng],
//                center: [60, 60],
//		zoom: this.zoom,
//                zoom: 3,
//		controls: ['zoomControl']
//	});
//}

mapObj.startMap = function() {
    ymaps.ready(function(){
        let allCoockies = document.cookie.split(';').reduce((cookies, cookie) => {
            const [ name, value ] = cookie.split('=').map(c => c.trim());
            cookies[name] = value;
            return cookies;
          }, {});
        console.log("Все кукисы = ", allCoockies);
        let n = document.getElementById("id_map_wave").options.selectedIndex;
        let wave = document.getElementById('id_map_wave').value;
        let wavePrevous = (document.getElementById("id_map_wave").options[n-1]) ? document.getElementById("id_wave").options[n-1].value: null;
        let url = new URL(window.location.href);
        url.pathname = "/ajax/yMap/";
        url.searchParams.set('wave', wave);
        url.searchParams.append('wavePr', wavePrevous);
        console.log("Полный путь на ajax - ", url.toString());
        mapObj.getData(url);
    });
}

document.getElementById("linkback99").onclick = function() {
    if (document.getElementById("pan")){
        document.getElementById("pan").style.display = 'none';
    }
    mapObj.backIndex();
    return false;
}

mapObj.backIndex = function(e){
    let n = document.getElementById("id_map_wave").options.selectedIndex;
    let wave = document.getElementById('id_map_wave').value;
    let wavePrevous = (document.getElementById("id_map_wave").options[n-1]) ? document.getElementById("id_map_wave").options[n-1].value: null;
    let link = new URL(mapObj.backLink);
    link.searchParams.set('wave', wave);
    link.searchParams.set('wavePr', wavePrevous);
    console.log("еще одна обратная ссылка = ", link);
    document.getElementById('mapsYandexSVG').innerHTML = '';
    if (mapObj.inType == 'div'){
            this.linkCluster = [];
            this.linkCity = [];
    } else if (mapObj.inType == 'cluster') {
            this.linkCity = [];
    }	
    mapObj.map = null;
    mapObj.inObject = {};
    mapObj.inType = {};
    mapObj.getData(link);
};

function getChk(id){
	let req; 
	let coord = [event.pageX+"px", event.pageY+"px"];
        let n = document.getElementById("id_map_wave").options.selectedIndex;
        let wave = document.getElementById('id_map_wave').value;
        let wavePrevous = (document.getElementById("id_map_wave").options[n-1]) ? document.getElementById("id_wave").options[n-1].value: null;
        let url = new URL(window.location.href);
        url.pathname = "/ajax/yMap/";
//        url.searchParams.set('type', 'div');
        url.searchParams.set('type', mapObj.inType);
        url.searchParams.append('id', id);
        url.searchParams.append('wave', wave);
        console.log("url точки = ", url.toString());
//	wave = document.getElementById('id_map_wave').value;
	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}
	req.onreadystatechange = function(){
		if (req.readyState == 4) {
			dat = req.responseText;
			var iObject = JSON.parse(dat);
			console.log(iObject);
			blk(iObject.data, coord);
		}
	};
	req.open("GET", url, true);
	req.send();
}

function blk(obj, coord){
    
        
	if (document.getElementById("pan")){
		document.getElementById('pan').parentNode.removeChild(document.getElementById('pan'));
	}
        Array.from(["mapsYandexSVG", "data003"], x => document.getElementById(x)).forEach((el, ind) => {
            el.addEventListener("mousedown" , function() {
		if (document.getElementById("pan")){
			document.getElementById('pan').parentNode.removeChild(document.getElementById('pan'));
		}
            });
            
        });

	var doc = document.getElementsByTagName("body")[0];
	var pan = document.createElement("div");
	pan.id = "pan";
	pan.style.cssText = "background:#FFF; border:1px solid #AAA; border-radius:5px; box-shadow:1px 1px 6px #444;";
	pan.style.position = "absolute";
	pan.style.width = "200px";
	pan.style.top = coord[1];
	pan.style.left = coord[0];
	pan.style.zIndex = "99";
	doc.appendChild(pan);

	var st0 = document.createElement("div");
	st0.style.cssText = "text-align:right; padding:5px; font-size:13px; position:absolute; right:1px";
	st0.innerHTML = '<a href="#" onClick="document.getElementById(\'pan\').parentNode.removeChild(document.getElementById(\'pan\'));" style="text-decoration:none; color:#BBB; font-weight:bold; padding:2px 6px 3px;">x</a>';
	pan.appendChild(st0);
        
        let iztype;
	if (obj[0].type) {
            console.log("Проверяем obj = ", obj);
		iztype = (obj[0].type == 1) ? "АЗК" : "АЗС"; 
	}
//        let iztype = "АЗК";

	var st1 = document.createElement("div");
	st1.style.cssText = "border-top:1px solid #DDD; text-align:center; padding:5px;";
        st1.innerHTML = ((iztype) ? iztype+" " : "")+" "+ "Проверка";
//	st1.innerHTML = ((iztype) ? iztype+" " : "")+" "+obj[0].sap_id;
	pan.appendChild(st1);
	
	var st = [];
        console.log("obj.length = ", obj.length);
	for(i=0; i < obj.length; i++){
		st[i] = document.createElement("div");
		st[i].style.cssText = "border-top:1px solid #EEE; text-align:center; padding:7px;";
		st[i].innerHTML = '<a href="https://rn.imystery.ru//page/show_anketa/?chk_id='+obj[i].chk_id+'" target="_blank">'+obj[i].date+'&nbsp;&nbsp;'+obj[i].tt+'</a>';
		pan.appendChild(st[i]);
	}
}

mapObj.startMap();


