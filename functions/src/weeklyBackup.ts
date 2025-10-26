import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as tar from "tar";
import * as fs from "fs";

admin.initializeApp();

export const weeklyBackup = functions.pubsub
  .schedule("every sunday 03:00")
  .timeZone("America/Mexico_City")
  .onRun(async () => {
    const fileName = `geoveraxis_backup_${Date.now()}.tar.gz`;
    const filePath = `/tmp/${fileName}`;
    const sourceDir = process.cwd(); // Directorio de la función

    try {
      // Crear un stream de escritura para el archivo tar.gz
      const writeStream = fs.createWriteStream(filePath);

      // Usar el paquete tar para comprimir el directorio
      await tar.c(
        {
          gzip: true,
          file: filePath,
          cwd: sourceDir,
        },
        ['.'] // Comprimir el directorio actual
      );

      const bucket = admin.storage().bucket();
      await bucket.upload(filePath, { destination: `backups/${fileName}` });
      
      fs.unlinkSync(filePath);
      
      console.log("✅ Backup semanal creado y subido a /backups/");

    } catch (error) {
      console.error("❌ Error creando el backup semanal:", error);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    return null;
  });
