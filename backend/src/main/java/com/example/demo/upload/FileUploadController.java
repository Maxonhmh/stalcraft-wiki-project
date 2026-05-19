package com.example.demo.upload;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/images")
    public UploadResponse uploadImage(@RequestParam("file") MultipartFile file) {
        return fileUploadService.uploadImage(file);
    }
}