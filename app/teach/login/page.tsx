"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import { solicitarAcceso, type LoginState } from "./actions";

/* ─────────────────────────────────────────────────────────────────────────────
   Login de /teach — réplica de
   Contenido-YetiBI-Teach/_ARCHIVO/diseno/mockup-teach-login.html.

   Modo noche completo, a diferencia del resto de /teach que es claro: acá no
   hay lectura larga, es la primera impresión y la marca vive en noche. El
   material sigue siendo claro adentro.

   La lógica de autenticación NO se toca: sigue siendo la server action
   solicitarAcceso, que verifica contra usuarios_autorizados antes de enviar
   nada. Esto es solo la capa visual y los tres estados.
   ────────────────────────────────────────────────────────────────────────── */

const estadoInicial: LoginState = { ok: false, mensaje: "" };

// Mensajes de los redirects del gate (/teach) y del callback del magic link.
const ERRORES: Record<string, string> = {
  sin_acceso:
    "Tu acceso a YetiBI Teach no está activo. Si creés que es un error, escribinos.",
  enlace_invalido:
    "Ese enlace ya no sirve: expiró o pediste otro más nuevo. Solo funciona el último enlace enviado — pedí uno acá abajo y usalo enseguida.",
  sin_codigo: "El enlace está incompleto o no es válido. Pedí uno nuevo acá abajo.",
};

const INCLUYE = [
  { n: "7", que: "unidades cortas" },
  { n: "1", que: "video de 4 min" },
  { n: "1", que: "guía en PDF" },
] as const;

function LoginForm() {
  const [estado, action, pending] = useActionState(solicitarAcceso, estadoInicial);
  const errorParam = useSearchParams().get("error");
  const mensajeRedirect = errorParam ? ERRORES[errorParam] : undefined;

  // Prioridad: lo que devuelve el submit; si no, el error del redirect.
  const mensaje = estado.mensaje || mensajeRedirect;
  const enviado = estado.ok;
  const rechazado = Boolean(mensaje) && !enviado;

  return (
    <div className="tl-card">
      {/* aria-live: el cambio de estado ocurre sin recargar, así que un lector
          de pantalla no se enteraría del resultado del envío. */}
      <div aria-live="polite">
        {enviado && (
          <>
            <div className="tl-estado tl-ok">
              <div>
                <p className="t">Revisa tu correo</p>
                <p className="d">
                  Enviamos un enlace a <b>{estado.correo}</b>. Ábrelo desde este
                  mismo dispositivo. Caduca en 1 hora.
                </p>
              </div>
            </div>
            <p className="tl-nota tl-nota-sola">
              ¿No llegó? Revisa spam, o{" "}
              <button type="button" className="tl-link" onClick={() => location.reload()}>
                vuelve a intentarlo
              </button>
              .
            </p>
          </>
        )}

        {rechazado && (
          <div className="tl-estado tl-no">
            <div>
              <p className="t">Ese correo no tiene acceso</p>
              {/* Redacción del mockup: no confirma ni niega si el correo existe
                  en la base — decirlo permitiría enumerar usuarios. */}
              <p className="d">{mensaje}</p>
            </div>
          </div>
        )}
      </div>

      {/* El formulario sigue disponible tras un rechazo (puede ser un tipeo);
          tras un envío exitoso se oculta para no gastar el cupo por reintento. */}
      {!enviado && (
        <>
          {!rechazado && (
            <>
              <h2>Entrar</h2>
              <p className="tl-ayuda">
                Escribe el correo con el que te dimos acceso. Te enviamos un
                enlace para entrar — no necesitas contraseña.
              </p>
            </>
          )}

          <form action={action}>
            <label className="tl-label" htmlFor="correo">
              CORREO
            </label>
            <input
              id="correo"
              name="correo"
              type="email"
              required
              autoComplete="email"
              placeholder="tu@empresa.com"
              className="tl-input"
            />
            <button type="submit" disabled={pending} className="tl-btn">
              {pending ? "Enviando…" : "Enviar enlace de acceso"}
            </button>
          </form>

          {rechazado ? (
            <a className="tl-btn tl-btn-sec" href="mailto:data@yetibi.com">
              Escribir a data@yetibi.com
            </a>
          ) : (
            <p className="tl-nota">
              El acceso es por invitación. Si tu correo no está en la lista,
              escríbenos a <a className="tl-mail" href="mailto:data@yetibi.com">data@yetibi.com</a>.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function TeachLoginPage() {
  return (
    <main className="tl-pantalla">
      <div className="tl-izq">
        <BrandMark
          href="/teach"
          ariaLabel="YetiBI Teach"
          symbolWidth={52}
          symbolWidthMobile={44}
          wordmark={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: 13,
            letterSpacing: "3px",
            color: "#F2F6F9",
            dotColor: "#4FD1E0",
            biColor: "#F28F6B",
          }}
        />

        <div className="tl-centro">
          <p className="tl-kicker">YETIBI TEACH</p>
          <h1>Entender la IA antes de usarla</h1>
          <p className="tl-lema">La herramienta predice; el criterio lo pones tú.</p>
          <p className="tl-desc">
            Material de capacitación preparado por Yeti BI para los equipos de
            los proyectos que acompañamos.
          </p>

          <div className="tl-incluye">
            {INCLUYE.map((i) => (
              <div key={i.que}>
                <b>{i.n}</b>
                <span>{i.que}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="tl-pie">© Yeti BI 2026 · Medellín, Colombia</p>
      </div>

      <div className="tl-der">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
