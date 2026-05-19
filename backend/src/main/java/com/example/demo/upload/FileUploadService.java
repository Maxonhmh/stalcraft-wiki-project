package com.example.demo.upload;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class FileUploadService {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif"
    );

    @Value("${app.upload-dir}")
    private String uploadDir;


    public UploadResponse uploadImage(MultipartFile file) {
    if (file.isEmpty()) {
        throw new RuntimeException("File is empty");
    }

    String contentType = file.getContentType();

    if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
        throw new RuntimeException("Only image files are allowed");
    }

    try {
        Path uploadPath = Paths.get(uploadDir, "images");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = getExtension(originalFilename);

        String filename = UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(filename);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return new UploadResponse(
                "/uploads/images/" + filename,
                filename
        );
    } catch (IOException exception) {
        throw new RuntimeException("Could not upload file");
    }
}



    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return ".png";
        }

        return filename.substring(filename.lastIndexOf("."));
    }
}