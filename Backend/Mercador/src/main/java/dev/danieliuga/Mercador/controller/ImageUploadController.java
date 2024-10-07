package dev.danieliuga.Mercador.controller;

import jakarta.annotation.Resource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ImageUploadController {

    private final ResourceLoader resourceLoader;
    private static final String IMAGE_FOLDER = "uploads/";

    public ImageUploadController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        System.out.println("DA");
        Resource resource = (Resource) resourceLoader.getResource("file:uploads/" + filename);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }



    @PostMapping("/upload")
    public ResponseEntity<?> uploadImages(@RequestParam("images") MultipartFile[] files) {
        List<String> imageUrls = new ArrayList<>();

        // Creează directorul dacă nu există
        File directory = new File(IMAGE_FOLDER);
        if (!directory.exists()) {
            directory.mkdir();  // Creează folderul "uploads"
        }

        for (MultipartFile file : files) {
            try {
                // Salvăm imaginea în folderul local
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(IMAGE_FOLDER + fileName);
                Files.write(filePath, file.getBytes());

                // URL-ul imaginii (poate fi modificat pentru a include adresa serverului)
                String imageUrl = "/uploads/" + fileName;
                imageUrls.add(imageUrl);

            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
            }
        }

        return ResponseEntity.ok().body(new ImageUploadResponse(imageUrls));
    }

    // Clasa pentru răspunsul JSON (poți adăuga getter și setter)
    public static class ImageUploadResponse {
        private List<String> imageUrls;

        public ImageUploadResponse(List<String> imageUrls) {
            this.imageUrls = imageUrls;
        }

        public List<String> getImageUrls() {
            return imageUrls;
        }
    }
}
