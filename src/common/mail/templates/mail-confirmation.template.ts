export const MailConfirmationTemplate = (verifyUrl: string) => {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div
      style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px"
    >
      <div
        style="
          max-width: 500px;
          margin: auto;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        "
      >
        <h2 style="color: #333">Bienvenido a Falta1</h2>
        <p style="color: #555">
          Gracias por registrarte. Para activar tu cuenta, haz clic en el
          siguiente botón:
        </p>

        <a
          href="${verifyUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            color: white;
            background: #007bff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 20px;
          "
        >
          Activar cuenta
        </a>

        <p style="color: #777; margin-top: 20px">
          Si no creaste esta cuenta, puedes ignorar este mensaje.
        </p>
      </div>
    </div>
  </body>
</html>

  `;
};
