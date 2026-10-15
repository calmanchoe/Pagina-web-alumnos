# Montar la plataforma como webapp propia

Dos registros gratuitos, unos 10 minutos. Al final me pegas un bloque de texto y yo me encargo del resto.

---

## Parte 1 · Firebase (la base de datos)

Es donde se guardará el progreso de Álvaro y Marcos para que no dependa del navegador.

1. Entra en **https://console.firebase.google.com** con tu cuenta de Gmail.
2. **Crear un proyecto** → nombre: `plataforma-ingles` → Continuar.
3. Te pregunta por **Google Analytics**: desactívalo. No lo necesitamos y evita pasos.
4. Ya dentro del proyecto, menú de la izquierda → **Compilación → Firestore Database** → **Crear base de datos**.
   - Ubicación: **eur3 (europe-west)** o la que te ofrezca en Europa.
   - Modo: elige **modo de prueba** (lo cambiamos en el paso 6).
5. Arriba del todo, el icono del **engranaje ⚙ → Configuración del proyecto**. Baja hasta **Tus aplicaciones** y pulsa el icono **`</>`** (Web).
   - Apodo: `web`.
   - **No** marques "Firebase Hosting".
   - Registrar aplicación.
6. Te mostrará un bloque de código con `const firebaseConfig = { ... }`. **Ese bloque es lo que necesito.** Cópialo entero.
7. Vuelve a **Firestore Database → pestaña Reglas** y sustituye todo por esto (pégalo tal cual y pulsa **Publicar**):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /clases/5c96aa91a9d5/progreso/{alumno} {
      allow read, write: if alumno in ['alvaro', 'marcos'];
    }
  }
}
```

Ese `5c96aa91a9d5` es un identificador aleatorio que he generado para tu clase: hace que nadie encuentre los datos por casualidad.

---

## Parte 2 · El hosting (dónde vive la página)

**Usa Cloudflare Pages.** Te lo explico abajo, pero el motivo es que Netlify cambió su plan gratuito en septiembre de 2025 a un sistema de créditos donde **cada publicación cuesta 15 de los 300 créditos mensuales** — unas 20 publicaciones al mes. Como vamos a ir añadiendo unidades y ejercicios, eso se queda corto. Cloudflare Pages no cobra por publicación.

1. Crea cuenta en **https://dash.cloudflare.com/sign-up** (solo email y contraseña).
2. En el panel: **Workers y Pages → Crear → Pages → Subir recursos** *(Upload assets)*.
3. Nombre del proyecto: `ingles` → te quedará una dirección tipo `ingles.pages.dev`.
4. Ahí arrastrarás el archivo que yo te prepare. La primera vez lo hacemos juntos.

> **Alternativa si prefieres GitHub:** vale igual GitHub Pages, también gratis y sin límite de publicaciones, pero el repositorio tiene que ser público para no pagar. No es un problema de seguridad real (ver la nota del final), solo que el código queda a la vista.

---

## Qué me tienes que pegar

Solo esto, del paso 6 de Firebase:

```
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Y dime también **qué contraseña quieres para tu pantalla de profesor** (la tuya, distinta de las de ellos).

---

## Qué haré yo con eso

1. Cambiar el almacenamiento: de «el navegador de cada uno» a «la base de datos», conservando lo que ya tengan hecho.
2. Añadir tu **pantalla de profesor**: los dos alumnos en una tabla, con porcentaje por nivel, última conexión, preguntas más falladas y el informe de autocorrecciones.
3. Dejar la app **instalable en el móvil** (icono en la pantalla de inicio, funciona sin cobertura y sincroniza al recuperarla).
4. Prepararte el archivo para subir a Cloudflare y las instrucciones de las futuras actualizaciones.

---

## Tres advertencias honestas

**Los límites que he encontrado** (fuentes de terceros, no la web oficial; confírmalos al registrarte): Firestore gratis da 50.000 lecturas y 20.000 escrituras al día y 1 GB de almacenamiento. Tus dos alumnos van a gastar unas 150 escrituras por sesión de estudio. No vas a acercarte al límite.

**Ojo con una novedad**: desde febrero de 2026, el *Cloud Storage* de Firebase ya no entra en el plan gratuito. No nos afecta — nosotros solo guardamos texto en Firestore, no archivos — pero si en la consola te ofrece activarlo, no lo hagas.

**Esto no es seguro de verdad.** Las claves de Firebase en una web son públicas por diseño; la protección está en las reglas. Con las reglas de arriba, quien tenga el enlace y sepa mirar el código podría leer o borrar el progreso. Para las notas de gramática de dos niños es un riesgo asumible. Si algún día quieres privacidad real, Firebase trae login de verdad y lo montamos — también gratis, pero son dos pantallas más y un paso extra para ellos al entrar.
