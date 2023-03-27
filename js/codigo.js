window.fn = {};

var ciudadElegida;
var infoCiudad;

window.fn.open = function () {
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function (page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page)
            .then(menu.close.bind(menu));
};

document.addEventListener("init", inicializarPagina);

function inicializarPagina(evt) {
    var destino = evt.target.id;
    switch (destino) {
        case "eleccion":
            $("#btnBuscar").click(hacerRecomendacion);
            $("#btnBuscar").click(mostrarLoader);
            $("#buscarEspecifica").click(buscarCiudadEspecifica);
            break;
        case "ciudad":
            $("#nombreCiudad").empty();
            $("#nombreCiudad").append('<h1>La ciudad recomendada es: ' + ciudadElegida + '</h1>' + '<input type="button" id="btnDetalles" class="button--large--cta" value="Ver detalles">');

        case "ampliacion":
            $("#btnDetalles").click(cargarDetalles);
            $("#detallesCiudad").empty();
            for (var i = 0; i < infoCiudad.length; i++) {
                $("#detallesCiudad").html('<div class="pronosticoPrincipal">' + '<h2 class="titCiudad">' + ciudadElegida + '</h2>' + '<p class="titFecha">' + infoCiudad[0]['dt_txt'] + '</p>' + '<div class="cajaTemperatura">' + '<img src= http://openweathermap.org/img/wn/' + infoCiudad[0]['weather'][0]['icon'] + '@2x.png>' + '<p>' + infoCiudad[0]['main']['temp'] + '° C' + '</p>' + '</div>' + '<p class="termica">Sensación térmica: ' + infoCiudad[0]['main']['feels_like'] + '° C' + '</p>' + '<p class="descripcion">' + infoCiudad[0]['weather'][0]['description'] + '</p>' + '</div>' + '<div class="pronosticoSecundario">' + '<p>' + infoCiudad[7]['dt_txt'] + '</p>' + '<p>' + infoCiudad[7]['main']['temp'] + '° C' + '</p>' + '<img src= http://openweathermap.org/img/wn/' + infoCiudad[7]['weather'][0]['icon'] + '@2x.png>' + '</div>' + '<div class="pronosticoSecundario2">' + '<p>' + infoCiudad[15]['dt_txt'] + '</p>' + '<p>' + infoCiudad[15]['main']['temp'] + '° C' + '</p>' + '<img src= http://openweathermap.org/img/wn/' + infoCiudad[15]['weather'][0]['icon'] + '@2x.png>' + '</div>' + '<div class="pronosticoSecundario">' + '<p>' + infoCiudad[23]['dt_txt'] + '</p>' + '<p>' + infoCiudad[23]['main']['temp'] + '° C' + '</p>' + '<img src= http://openweathermap.org/img/wn/' + infoCiudad[23]['weather'][0]['icon'] + '@2x.png>' + '</div>' + '<div class="pronosticoSecundario2">' + '<p>' + infoCiudad[31]['dt_txt'] + '</p>' + '<p>' + infoCiudad[31]['main']['temp'] + '° C' + '</p>' + '<img src= http://openweathermap.org/img/wn/' + infoCiudad[31]['weather'][0]['icon'] + '@2x.png>' + '</div>' + '<div class="pronosticoSecundario">' + '<p>' + infoCiudad[39]['dt_txt'] + '</p>' + '<p>' + infoCiudad[39]['main']['temp'] + '° C' + '</p>' + '<img src= http://openweathermap.org/img/wn/' + infoCiudad[39]['weather'][0]['icon'] + '@2x.png>' + '</div>');
            }

        case "especifica":
            $("#btnBuscarEspecifica").click(hacerRecomendacionEspecifica);
    }
}

function hacerRecomendacionEspecifica() {
    ciudadElegida = $("#txtEspecifica").val();
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast",
        dataType: "JSON",
        type: "GET",
        data: {
            q: ciudadElegida,
            appid: "e62b2530fdb5f4ba3559c07c8634e5c7",
            lang: "es",
            units: "metric"
        },
        success: mostrarEspecifica,
        error: mostrarError2,
        beforeSend: mostrarLoader2
    });
}

function mostrarEspecifica(ciuEsp) {
    infoCiudad = ciuEsp['list'];
    cargarDetalles();
}

function mostrarLoader() {
    $("#eleccion").append('<div class="progress-bar progress-bar--indeterminate">' + '</div>');
}

function mostrarLoader2() {
    $("#especifica").append('<div class="progress-bar progress-bar--indeterminate">' + '</div>');
}

function hacerRecomendacion() {
    buscarClima();
}
function buscarClima(ciudad) {
    var clima;
    var clima2;
    var ciudad = $("#txtCiudad").val();
    var ciudad2 = $("#txtCiudad2").val();
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast",
        dataType: "JSON",
        type: "GET",
        data: {
            q: ciudad,
            appid: "e62b2530fdb5f4ba3559c07c8634e5c7",
            lang: "es",
            units: "metric"
        },
        success: function (infoClima) {
            clima = infoClima['list'];
            $.ajax({
                url: "http://api.openweathermap.org/data/2.5/forecast",
                dataType: "JSON",
                type: "GET",
                data: {
                    q: ciudad2,
                    appid: "e62b2530fdb5f4ba3559c07c8634e5c7",
                    lang: "es",
                    units: "metric"
                },
                success: function (infoClima2) {
                    clima2 = infoClima2['list'];
                    hacerCalculos(clima, clima2, ciudad, ciudad2);
                },
                error: mostrarError2
            });
        },
        error: mostrarError
    });
}

function mostrarError() {

}
function mostrarError2() {

}

function hacerCalculos(c, c2, ciu, ciu2) {
    var contador = 0;
    var contador2 = 0;
    for (var i = 0; i < c.length; i++) {
        var id = c[i]['weather'][0]['id'];
        var id2 = c2[i]['weather'][0]['id'];

        if (id >= [800]) {
            contador++;
        }
        if (id2 >= [800]) {
            contador2++;
        }
    }
    if (contador > contador2) {
        ciudadElegida = ciu;
        infoCiudad = c;
        document.getElementById('content').load("ciudadRecomendada");
    } else if (contador < contador2) {
        ciudadElegida = ciu2;
        infoCiudad = c2;
        document.getElementById('content').load("ciudadRecomendada");
    } else {
        ciudadElegida = ciu;
        infoCiudad = c;
        document.getElementById('content').load("ciudadRecomendada");
    }
}
function cargarDetalles() {
    document.getElementById('content').load("ciudadAmpliada");
}
function buscarCiudadEspecifica() {
    document.getElementById('content').load("ciudadEspecifica");
}