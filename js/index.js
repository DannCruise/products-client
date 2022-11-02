$(function(){
    getProductos();
});

var url= 'http://localhost/api-products/';

function getProductos(){
    $('#contenido').empty();
    $.ajax({
        type:'GET',
        url:url,
        dataType:'json',
        success: function(respuesta){
            var productos = respuesta;
            if(productos.length > 0){
                jQuery.each(productos,function(i,prod){
                    var btnEditar='<button class="btn btn-warning openModal" data-id="'+prod.id+'" data-nombre="'+prod.name+'" data-descripcion="'+prod.description+'" data-precio="'+prod.price+'"  data-op="2" data-bs-toggle="modal" data-bs-target="#modalProductos"><i class="fa-solid fa-edit"></i></button>';
                    var btnEliminar='<button class="btn btn-danger delete" data-id="'+prod.id+'" data-nombre="'+prod.name+'"><i class="fa-solid fa-trash"></i></button>';
                    $('#contenido').append('<tr><td>'+(i+1)+'</td><td>'+prod.name+'</td><td>'+prod.description+'</td><td>$'+ new Intl.NumberFormat('es-mx').format(prod.price)+'</td><td class="text-center">'+btnEditar+'   '+btnEliminar+'</td></tr>');
                });
            }
        },
        error:function(){
            show_alerta('Error al mostrar los productos','error');
        }
    });
}

$(document).on('click','#btnGuardar',function(){
    var id = $('#id').val();
    var nombre = $('#nombre').val().trim();
    var descripcion = $('#descripcion').val().trim();
    var precio = $('#precio').val();
    var opcion = $('#btnGuardar').attr('data-operacion');
    var metodo, parametros;
    if(opcion == '1'){
        metodo='POST';
        parametros={name:nombre,description:descripcion,price:precio};
    }
    else{
        metodo='PUT';
        parametros={id:id,name:nombre,description:descripcion,price:precio};
    }
    if(nombre === ''){
        show_alerta('Escribe el nombre del producto','warning','nombre');
    }
    else if(descripcion === ''){
        show_alerta('Escribe la descripción del producto','warning','descripcion');
    }
    else if(precio === ''){
        show_alerta('Escribe el precio del producto','warning','precio');
    }
    else{
        enviarSolicitud(metodo,parametros);
    }
});

$(document).on('click','.delete',function(){
    var id= $(this).attr('data-id');
    var nombre= $(this).attr('data-nombre');
    const swalWithBootstrapButtons= Swal.mixin({
        customClass:{confirmButton: 'btn btn-success ms-3',cancelButton:'btn btn-danger'},buttonsStyling:false
    });
    swalWithBootstrapButtons.fire({
        title:'seguro de eliminar el producto: '+nombre,
        text:' Se perderá la información del producto',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText:'Si, eliminar',
        cancelButtonText: 'cancelar',
        reverseButtons: true
    }).then((result) => {
        if(result.isConfirmed){
            enviarSolicitud('DELETE',{id:id});
        }
        else{
            show_alerta('El producto NO fue eliminado','error');
        }
    })
    ;
});

function enviarSolicitud(metodo,parametros){
    $.ajax({
        type:metodo,
        url:url,
        data:JSON.stringify(parametros),
        dataType:'json',
        success: function(respuesta){
            show_alerta(respuesta[1],respuesta[0]);
            if(respuesta[0] === 'success'){
                $('#btnCerrar').trigger('click');
                getProductos();
            }
        },
        error: function(){
            show_alerta('Error en la solicitud','error');
        }
    });

}

$(document).on('click','.openModal',function(){
    limpiar();
    var opcion= $(this).attr('data-op');
    if(opcion=='1'){
        $('#titulo_modal').html('Registrar producto');
        $('#btnGuardar').attr('data-operacion',1);
    }
    else{
        $('#titulo_modal').html('Editar producto');
        $('#btnGuardar').attr('data-operacion',2);
        var id= $(this).attr('data-id');
        var nombre= $(this).attr('data-nombre');
        var descripcion= $(this).attr('data-descripcion');
        var precio= $(this).attr('data-precio');
        $('#id').val(id);
        $('#nombre').val(nombre);
        $('#descripcion').val(descripcion);
        $('#precio').val(precio);
    }
    window.setTimeout(function(){
        $('#nombre').trigger('focus');
    },500);
    
});

function limpiar(){
    $('#id').val('');
    $('#nombre').val('');
    $('#descripcion').val('');
    $('#precio').val('');
}

function show_alerta(mensaje,icono,foco){
    if(foco !==""){
        $('#'+foco).trigger('focus');
    }
    Swal.fire({
        title:mensaje,
        icon:icono,
        customClass: {confirmButton: 'btn btn-primary', popup:'animated zoomIn' },
        buttonsStyling:false
    });
}