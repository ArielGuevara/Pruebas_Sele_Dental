# Análisis SonarQube - Funciones Específicas

## Archivos incluidos en el análisis:

### 1. usuarioController.js
**Ruta:** `servidor/src/controllers/usuarioController.js`
**Función principal a analizar:** `actualizarUsuario`
- **Líneas aproximadas:** 126-278
- **Descripción:** Función que maneja la actualización de usuarios existentes
- **Características clave:**
  - Validación de permisos según rol
  - Verificación de datos únicos (email, cédula)
  - Actualización de perfil completo
  - Manejo de errores y validaciones

### 2. authController.js  
**Ruta:** `servidor/src/controllers/authController.js`
**Función principal a analizar:** `completarPerfil`
- **Líneas aproximadas:** 219-285
- **Descripción:** Función que permite completar el perfil de usuario
- **Características clave:**
  - Validación de datos del perfil
  - Actualización de información personal
  - Marcado de perfil como completo

## Configuración de SonarQube

El archivo `sonar-project.properties` ha sido configurado para analizar únicamente estos dos archivos, permitiendo un análisis focalizado en las funciones específicas mencionadas.

## Métricas de interés:

1. **Complejidad ciclomática**
2. **Cobertura de código**
3. **Duplicación de código**
4. **Vulnerabilidades de seguridad**
5. **Code smells**
6. **Mantenibilidad**

## Comandos para ejecutar el análisis:

```bash
# Desde el directorio raíz del proyecto
sonar-scanner
```

## Notas importantes:

- Asegúrate de tener configurado el token de autenticación en `sonar.login`
- Verifica que el servidor SonarQube esté ejecutándose en `http://localhost:9000`
- El proyecto debe existir en SonarQube o tienes permisos para crearlo
