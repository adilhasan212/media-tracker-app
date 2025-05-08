package com.showtracker.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "media")
public class Media {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mediaType;
    private String mediaTitle;
    private String mediaStatus;
    private String mediaPlatform;
    private String mediaNotes;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Media() {}

    public Media(String mediaType, String mediaTitle, String mediaStatus, String mediaNotes, User user) {
        this.mediaType = mediaType;
        this.mediaTitle = mediaTitle;
        this.mediaStatus = mediaStatus;
        this.mediaPlatform = mediaPlatform;
        this.mediaNotes = mediaNotes;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getMediaType() {
        return mediaType;
    }

    public String getMediaTitle() {
        return mediaTitle;
    }

    public String getMediaStatus() {
        return mediaStatus;
    }

    public String getMediaPlatform() {
        return mediaPlatform;
    }

    public String getMediaNotes() {
        return mediaNotes;
    }

    public User getUser() {
        return user;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public void setMediaTitle(String mediaTitle) {
        this.mediaTitle = mediaTitle;
    }

    public void setMediaStatus(String mediaStatus) {
        this.mediaStatus = mediaStatus;
    }

    public void setMediaPlatform(String mediaPlatform) {
        this.mediaPlatform = mediaPlatform;
    }

    public void setMediaNotes(String mediaNotes) {
        this.mediaNotes = mediaNotes;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
