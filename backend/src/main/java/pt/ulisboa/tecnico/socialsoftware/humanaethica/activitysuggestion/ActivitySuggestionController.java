package pt.ulisboa.tecnico.socialsoftware.humanaethica.activitysuggestion;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import pt.ulisboa.tecnico.socialsoftware.humanaethica.activitysuggestion.dto.ActivitySuggestionDto;
import pt.ulisboa.tecnico.socialsoftware.humanaethica.auth.domain.AuthUser;

@RestController
@RequestMapping("/activitySuggestions")
public class ActivitySuggestionController {
    @Autowired
    private ActivitySuggestionService activitySuggestionService;

    @GetMapping("/institution/{institutionId}")
    @PreAuthorize("hasRole('ROLE_MEMBER') and hasPermission(#institutionId, 'INSTITUTION.MEMBER')")
    public List<ActivitySuggestionDto> getActivitySuggestions(@PathVariable Integer institutionId) {
        return this.activitySuggestionService.getActivitySuggestionsByInstitution(institutionId);
    }

    // Obter a lista de sugestões de atividades pelo voluntário
    @GetMapping("/volunteer")
    @PreAuthorize("(hasRole('ROLE_VOLUNTEER'))")
    public List<ActivitySuggestionDto> getActivitySuggestionsByVolunteer(Principal principal) {
        int userId = ((AuthUser) ((Authentication) principal).getPrincipal()).getUser().getId();
        return activitySuggestionService.getActivitySuggestionsByVolunteer(userId);
    }

    @PostMapping("/institution/{institutionId}")
    @PreAuthorize("hasRole('ROLE_VOLUNTEER')")
    public ActivitySuggestionDto createActivitySuggestion(Principal principal, @PathVariable Integer institutionId, @Valid @RequestBody ActivitySuggestionDto activitySuggestionDto) {
        int userId = ((AuthUser) ((Authentication) principal).getPrincipal()).getUser().getId();
        return activitySuggestionService.createActivitySuggestion(userId, institutionId, activitySuggestionDto);
    }

    // Aprovar activitySuggestion
    @PutMapping("/{activitySuggestionId}/approve")
    @PreAuthorize("hasRole('ROLE_MEMBER')")
    public ActivitySuggestionDto approveActivitySuggestion(@PathVariable Integer activitySuggestionId) {
        return activitySuggestionService.approveActivitySuggestion(activitySuggestionId);
    }

    // Rejeitar activitySuggestion
    @PutMapping("/{activitySuggestionId}/reject")
    @PreAuthorize("hasRole('ROLE_MEMBER')")
    public ActivitySuggestionDto rejectActivitySuggestion(@PathVariable Integer activitySuggestionId) {
        return activitySuggestionService.rejectActivitySuggestion(activitySuggestionId);
    }


}