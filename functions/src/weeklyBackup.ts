import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import * as tar from "tar";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// Asegurarse de que la app de admin se inicializa solo una vez.
if (!admin.apps.length) {
  admin.initializeApp();
}

export const weeklyBackup = onSchedule("every sunday 03:00", async () => {
    const fileName = `geoveraxis_backup_${Date.now()}.tar.gz`;
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const sourceDir = process.cwd();

    try {
      // Crear un stream de escritura para el archivo tar.gz en el directorio temporal
      await tar.c(
        {
          gzip: true,
          file: tempFilePath,
          cwd: sourceDir,
        },
        ['.'] // Comprimir el directorio actual de la función
      );

      console.log(`Backup temporal creado en: ${tempFilePath}`);

      const bucket = admin.storage().bucket();
      await bucket.upload(tempFilePath, { destination: `backups/${fileName}` });
      
      // Eliminar el archivo temporal después de subirlo
      fs.unlinkSync(tempFilePath);
      
      console.log(`✅ Backup semanal '${fileName}' creado y subido a /backups/`);

    } catch (error) {
      console.error("❌ Error creando el backup semanal:", error);
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
});