const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, rol, activo, cedula, fechaNacimiento, celular, direccion } = req.body;
    
    // Verificar que el usuario existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return errorResponse(res, 404, 'Usuario no encontrado');
    }
    
    // Verificar permisos según el rol
    if (req.usuario.rol === 'recepcionista') {
      // Las recepcionistas solo pueden actualizar clientes
      if (usuario.rol !== 'cliente') {
        return errorResponse(res, 403, 'No tiene permisos para actualizar este usuario');
      }
      
      // Las recepcionistas no pueden cambiar el rol
      if (rol && rol !== 'cliente') {
        return errorResponse(res, 403, 'No tiene permisos para cambiar el rol');
      }
      
      // Las recepcionistas no pueden desactivar usuarios
      if (activo !== undefined && activo !== usuario.activo) {
        return errorResponse(res, 403, 'No tiene permisos para cambiar el estado de activación');
      }
    } else if (req.usuario.rol === 'odontologo') {
      // Los odontólogos solo pueden actualizar su propio perfil
      if (req.usuario.id !== parseInt(id)) {
        return errorResponse(res, 403, 'Solo puede actualizar su propio perfil');
      }
      
      // Los odontólogos no pueden cambiar su rol ni estado de activación
      if (rol && rol !== usuario.rol) {
        return errorResponse(res, 403, 'No tiene permisos para cambiar el rol');
      }
      if (activo !== undefined && activo !== usuario.activo) {
        return errorResponse(res, 403, 'No tiene permisos para cambiar el estado de activación');
      }
    } else if (req.usuario.rol !== 'administrador') {
      // Verificar permisos: solo el propio usuario o un administrador pueden actualizar
      if (req.usuario.id !== parseInt(id)) {
        return errorResponse(res, 403, 'No tiene permisos para actualizar este usuario');
      }
      
      // Si el usuario no es administrador, no puede cambiar su propio rol ni estado de activación
      if (rol && rol !== usuario.rol) {
        return errorResponse(res, 403, 'No tiene permisos para cambiar el rol');
      }
      if (activo !== undefined && activo !== usuario.activo) {
        return errorResponse(res, 403, 'No tiene permisos para cambiar el estado de activación');
      }
    }
    
    // NUEVA VALIDACIÓN: Prevenir que un administrador cambie su propio rol
    if (req.usuario.id === parseInt(id) && req.usuario.rol === 'administrador' && rol && rol !== 'administrador') {
      return errorResponse(res, 403, 'No puede cambiar su propio rol de administrador');
    }
    
    // Si se está actualizando el email, verificar que no esté en uso
    if (email && email !== usuario.email) {
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return errorResponse(res, 400, 'El correo electrónico ya está en uso');
      }
    }
    
    // Si se está actualizando la cédula, verificar que no esté en uso
    if (cedula && cedula !== usuario.cedula) {
      const usuarioConCedula = await Usuario.findOne({ 
        where: { 
          cedula,
          id: { [require('sequelize').Op.ne]: id }
        } 
      });
      if (usuarioConCedula) {
        return errorResponse(res, 400, 'La cédula ya está registrada por otro usuario');
      }
    }
    
    // Validar el rol (si se proporciona)
    if (rol) {
      const rolesValidos = ['administrador', 'recepcionista', 'cliente', 'odontologo'];
      if (!rolesValidos.includes(rol)) {
        return errorResponse(res, 400, 'Rol no válido', { 
          rolesValidos 
        });
      }
    }
    
    // Determinar si el perfil está completo
    let perfilCompleto = usuario.perfilCompleto;
    if (usuario.rol === 'cliente' || rol === 'cliente') {
      const cedulaFinal = cedula !== undefined ? cedula : usuario.cedula;
      const fechaNacimientoFinal = fechaNacimiento !== undefined ? fechaNacimiento : usuario.fechaNacimiento;
      const celularFinal = celular !== undefined ? celular : usuario.celular;
      const direccionFinal = direccion !== undefined ? direccion : usuario.direccion;
      
      perfilCompleto = !!(cedulaFinal && fechaNacimientoFinal && celularFinal && direccionFinal);
    } else {
      perfilCompleto = true;
    }
    
    // Actualizar el usuario
    await usuario.update({
      nombre: nombre !== undefined ? nombre : usuario.nombre,
      apellido: apellido !== undefined ? apellido : usuario.apellido,
      email: email !== undefined ? email : usuario.email,
      password: password || undefined,
      rol: rol !== undefined ? rol : usuario.rol,
      activo: activo !== undefined ? activo : usuario.activo,
      cedula: cedula !== undefined ? cedula : usuario.cedula,
      fechaNacimiento: fechaNacimiento !== undefined ? fechaNacimiento : usuario.fechaNacimiento,
      celular: celular !== undefined ? celular : usuario.celular,
      direccion: direccion !== undefined ? direccion : usuario.direccion,
      perfilCompleto
    });
    
    // Obtener el usuario actualizado (sin la contraseña)
    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    
    return successResponse(res, 200, 'Usuario actualizado correctamente', { 
      usuario: usuarioActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errores = error.errors.map(err => ({
        campo: err.path,
        mensaje: err.message
      }));
      return errorResponse(res, 400, 'Error de validación', errores);
    }
    
    return errorResponse(res, 500, 'Error al actualizar el usuario');
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    // El middleware auth ya añadió req.usuario con el ID del usuario autenticado
    const usuarioId = req.usuario.id;
    
    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: { exclude: ['password'] } // Excluir la contraseña de la respuesta
    });
    
    if (!usuario) {
      return errorResponse(res, 404, 'Usuario no encontrado');
    }
    
    return successResponse(res, 200, 'Perfil obtenido correctamente', { 
      usuario 
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return errorResponse(res, 500, 'Error al obtener el perfil del usuario');
  }
};