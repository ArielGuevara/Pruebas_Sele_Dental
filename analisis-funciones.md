# Análisis SonarQube - Módulo de Pruebas

## Archivo incluido en el análisis:

### 1. pruebas.js
**Ruta:** `servidor/src/sonarQ/pruebas.js`
**Funciones principales a analizar:**

#### Función `actualizarUsuario`
- **Líneas:** 1-142
- **Descripción:** Función que maneja la actualización de usuarios existentes
- **Características clave:**
  - Validación de permisos según rol (recepcionista, odontologo, administrador)
  - Verificación de datos únicos (email, cédula)
  - Control de acceso granular por tipo de usuario
  - Prevención de auto-eliminación de administradores
  - Actualización de perfil completo
  - Manejo comprehensivo de errores y validaciones

#### Función `obtenerPerfil`
- **Líneas:** 143-164
- **Descripción:** Función que obtiene el perfil del usuario autenticado
- **Características clave:**
  - Autenticación basada en middleware
  - Exclusión de información sensible (contraseñas)
  - Manejo de errores de base de datos
  - Respuestas estructuradas

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
