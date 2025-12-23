package com.example.PBL3.service;

import com.example.PBL3.config.FileStorageProperties;  
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path fileStorageLocation;
    private static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "pdf", "doc", "docx", "xls", "xlsx"};
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();
    }
    
    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(fileStorageLocation);
            System.out.println("Đã tạo thư mục tải lên tại: " + fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Không thể tạo thư mục lưu trữ file tại: " + fileStorageLocation, ex);
        }
    }

    public String storeFile(MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("File rỗng. Vui lòng chọn file cần tải lên.");
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("Kích thước file vượt quá giới hạn cho phép (5MB).");
        }

        // Get file extension
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        try {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".") + 1).toLowerCase();
        } catch (Exception e) {
            throw new RuntimeException("Định dạng file không hợp lệ");
        }

        // Validate file extension
        boolean isValidExtension = false;
        for (String extension : ALLOWED_EXTENSIONS) {
            if (fileExtension.equals(extension)) {
                isValidExtension = true;
                break;
            }
        }
        if (!isValidExtension) {
            throw new RuntimeException("Định dạng file không được hỗ trợ. Chỉ chấp nhận: " + String.join(", ", ALLOWED_EXTENSIONS));
        }

        // Generate unique file name
        String fileName = UUID.randomUUID().toString() + "." + fileExtension;
        
        try {
            // Create target directory if not exists
            if (!Files.exists(this.fileStorageLocation)) {
                Files.createDirectories(this.fileStorageLocation);
            }
            
            // Copy file to target location
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Không thể lưu file " + originalFileName + ". Vui lòng thử lại!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("Không tìm thấy file " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Lỗi khi tải file " + fileName, ex);
        }
    }
    
    public boolean deleteFile(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            return Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Lỗi khi xóa file " + fileName, ex);
        }
    }
}
