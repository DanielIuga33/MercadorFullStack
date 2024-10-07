package dev.danieliuga.Mercador.controller;

import dev.danieliuga.Mercador.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
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
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ImageUploadController {

    private final ResourceLoader resourceLoader;
    private static final String IMAGE_FOLDER = "uploads/";

    @Autowired
    private CarRepository carRepository;

    public ImageUploadController(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getImage(@PathVariable String filename) {
        Resource resource = resourceLoader.getResource("file:uploads/" + filename);
        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
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
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading images");
            }
        }
        return ResponseEntity.ok().body(new ImageUploadResponse(imageUrls));
    }

    @DeleteMapping("/cleanup-images")
    public ResponseEntity<String> cleanupImages() {
        try (Stream<Path> paths = Files.walk(Paths.get(IMAGE_FOLDER))) {
            // Obținem lista tuturor fișierelor din folderul "uploads"
            List<Path> fileList = paths.filter(Files::isRegularFile).toList();

            // Obținem lista tuturor numelor de imagini din baza de date
            List<String> imagesInDatabase = carRepository.findAll().stream()
                    .flatMap(car -> car.getImages().stream()).toList();

            for (Path filePath : fileList) {
                String fileName = filePath.getFileName().toString();
                String fileNameWExt = "/uploads/".concat(fileName);

                // Verificăm dacă fișierul există înainte de ștergere
                if (!imagesInDatabase.contains(fileNameWExt)) {
                    if (Files.exists(filePath)) {
                        Files.delete(filePath);  // Șterge fișierul doar dacă există
                        System.out.println("Deleted file: " + fileName);
                    } else {
                        System.out.println("File not found, cannot delete: " + fileName);
                    }
                }
            }

            return ResponseEntity.ok("Cleanup completed");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during cleanup");
        }
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
