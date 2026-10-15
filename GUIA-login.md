# Activar el login (Firebase Authentication)

Cuatro pasos en la consola de Firebase. Los dos primeros y el último son tuyos porque
implican **escribir contraseñas**, algo que yo no puedo hacer por ti.

Consola: https://console.firebase.google.com → proyecto **ingles-web-alumnos**

---

## 1 · Activar Authentication

1. Menú izquierdo → **Compilación → Authentication** → **Comenzar** *(Get started)*.
2. Pestaña **Método de acceso** *(Sign-in method)* → **Correo electrónico/contraseña**.
3. Activa **solo el primer interruptor** (Correo electrónico/contraseña). **No** actives
   «Vínculo de correo electrónico (acceso sin contraseña)».
4. **Guardar**.

## 2 · Crear las tres cuentas

Pestaña **Usuarios** → **Añadir usuario**. Una por cada línea:

| Correo | Contraseña |
|---|---|
| `alvaro@cuaderno.local` | la que elijas para Álvaro |
| `marcos@cuaderno.local` | la que elijas para Marcos |
| **tu correo real** | la tuya, de profesor |

- Los correos `@cuaderno.local` **no son buzones reales**: solo son identificadores. Escríbelos
  exactamente así, en minúsculas y sin espacios.
- Firebase pide **mínimo 6 caracteres**.
- Para tu cuenta usa **un correo que sea tuyo**; con él entrarás en «Soy el profe».

## 3 · Cerrar el registro de cuentas nuevas

Authentication → pestaña **Configuración** *(Settings)* → **Acciones del usuario** →
**desmarca «Habilitar creación (registro)»** *(Enable create / sign-up)* → Guardar.

Sin esto, cualquiera que mire el código podría crear una cuenta nueva en tu proyecto. Con las
reglas del paso 4 no podría leer nada, pero es mejor que ni siquiera pueda registrarse. Tus tres
cuentas ya existen, así que no te afecta.

## 4 · Cambiar las reglas de Firestore (lo último)

**Hazlo al final**, cuando yo te avise de que el código nuevo ya está publicado. Si lo cambias
antes, la web que usan ahora los alumnos dejaría de guardar.

Firestore Database → pestaña **Reglas** → sustituye todo por esto, **cambiando
`CORREO_DEL_PROFE` por tu correo real, en minúsculas**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clases/5c96aa91a9d5/progreso/{alumno} {
      allow read: if request.auth != null
                  && alumno in ['alvaro', 'marcos']
                  && (request.auth.token.email == alumno + '@cuaderno.local'
                      || request.auth.token.email == 'CORREO_DEL_PROFE');
      allow write: if request.auth != null
                   && alumno in ['alvaro', 'marcos']
                   && request.auth.token.email == alumno + '@cuaderno.local';
    }
  }
}
```

**Publicar.**

Qué hacen:
- Álvaro **solo** lee y escribe su propio documento. Marcos, el suyo.
- Tú **lees** los dos (para el panel del profesor) pero no escribes.
- Quien no haya iniciado sesión no puede hacer nada.

---

## Qué cambia para los alumnos

- Tocan su tarjeta, escriben su contraseña y entran. La sesión **se recuerda** en el
  dispositivo: no la vuelven a pedir hasta que pulsen «cambiar de alumno».
- Ya no hay contraseñas en el código de la web: las comprueba Firebase en su servidor.
