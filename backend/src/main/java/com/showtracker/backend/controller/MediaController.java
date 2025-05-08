package com.showtracker.backend.controller;

import com.showtracker.backend.model.Media;
import com.showtracker.backend.model.User;
import com.showtracker.backend.repository.MediaRepository;
import com.showtracker.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    @Autowired
    private MediaRepository mediaRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/createMedia")
    public Media createMedia(@RequestBody Media media) {
        return mediaRepository.save(media);
    }

    @PostMapping("/createMedia/{userId}")
    public Media createMediaForUser(@RequestBody Media media, @PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            media.setUser(userOpt.get());
            return mediaRepository.save(media);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @GetMapping
    public List<Media> getAllMedia() {
        return mediaRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<Media> getMediaByUser(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            return mediaRepository.findByUser(userOpt.get());
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @DeleteMapping("/{id}")
    public void deleteMedia(@PathVariable Long id) {
        try {
            mediaRepository.deleteById(id);
            System.out.println("Media deleted successfully.");
        } catch (Exception e) {
            System.out.println("Failed to delete media: " + e.getMessage());
        }
    }

}
