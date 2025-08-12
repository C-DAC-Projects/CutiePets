package com.cutiepets.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;

@RestController
@RequestMapping("/images")
public class PetImageController {

    private final String BASE_PATH = "D:/FINAL PROJECT/Resources/Pets/";

    @GetMapping("/view/{folder}/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String folder,
                                             @PathVariable String filename) {
        try {
            // Construct the full path
            Path imagePath = Paths.get(BASE_PATH, folder, filename);
            Resource resource;

            // Check if the file exists
            if (!Files.exists(imagePath)) {
                // If not found, use placeholder (optional)
                Path placeholder = Paths.get(BASE_PATH, "default", "no-image.jpg");

                if (!Files.exists(placeholder)) {
                    return ResponseEntity.notFound().build();
                }

                resource = new UrlResource(placeholder.toUri());
                imagePath = placeholder; // needed to get contentType
            } else {
                resource = new UrlResource(imagePath.toUri());
            }

            // Try to determine content type
            String contentType = Files.probeContentType(imagePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
