package com.chalang_backend.resource;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    private final ResourceRepo resourceRepo;

    public ResourceService(ResourceRepo resourceRepo) {
        this.resourceRepo = resourceRepo;
    }

    public Resource createResource(Resource resource) {
        return resourceRepo.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepo.findAll();
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepo.findById(id);
    }

    public boolean deleteResource(Long id) {
        if (resourceRepo.existsById(id)) {
            resourceRepo.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Resource> updateResource(Long id, Resource resourceDetails) {
        return resourceRepo.findById(id).map(resource -> {
            resource.setTitle(resourceDetails.getTitle());
            resource.setCategory(resourceDetails.getCategory());
            resource.setDescription(resourceDetails.getDescription());
            resource.setLink(resourceDetails.getLink());
            return resourceRepo.save(resource);
        });
    }
}
