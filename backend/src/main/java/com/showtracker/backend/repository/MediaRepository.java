package com.showtracker.backend.repository;

import com.showtracker.backend.model.Media;
import com.showtracker.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByMediaTitle(String mediaTitle);
    List<Media> findByMediaType(String mediaType);
    List<Media> findByMediaStatus(String mediaStatus);
    List<Media> findByUser(User user); 
}
