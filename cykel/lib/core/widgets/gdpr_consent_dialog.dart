/// CYKEL — GDPR Consent Dialog
/// First-launch consent dialog for data collection

import 'package:flutter/material.dart';
import '../services/consent_manager.dart';
import '../theme/app_colors.dart';

class GDPRConsentDialog extends StatefulWidget {
  final ConsentManager consentManager;
  final VoidCallback onCompleted;

  const GDPRConsentDialog({
    super.key,
    required this.consentManager,
    required this.onCompleted,
  });

  @override
  State<GDPRConsentDialog> createState() => _GDPRConsentDialogState();
}

class _GDPRConsentDialogState extends State<GDPRConsentDialog> {
  final bool _locationConsent = true; // Required for core functionality
  bool _analyticsConsent = true;
  bool _marketingConsent = false;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 500),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.privacy_tip_outlined,
                    color: AppColors.primary,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Your Privacy Matters',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: context.colors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Choose how we use your data',
                        style: TextStyle(
                          fontSize: 14,
                          color: context.colors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Introduction
            const Text(
              'We value your privacy and comply with GDPR. Please review and accept our data usage policies:',
              style: TextStyle(
                fontSize: 14,
                height: 1.5,
                color: AppColors.mutedForeground,
              ),
            ),
            const SizedBox(height: 20),

            // Location Consent (Required)
            _buildConsentTile(
              icon: Icons.location_on_outlined,
              title: 'Location Services',
              description: 'Required to show nearby rides, events, and services. You can control permissions in device settings.',
              value: _locationConsent,
              isRequired: true,
              onChanged: null,
            ),

            const SizedBox(height: 12),

            // Analytics Consent (Optional)
            _buildConsentTile(
              icon: Icons.analytics_outlined,
              title: 'Analytics & Performance',
              description: 'Help us improve the app by collecting anonymous usage data.',
              value: _analyticsConsent,
              isRequired: false,
              onChanged: (value) => setState(() => _analyticsConsent = value),
            ),

            const SizedBox(height: 12),

            // Marketing Consent (Optional)
            _buildConsentTile(
              icon: Icons.email_outlined,
              title: 'Marketing Communications',
              description: 'Receive updates about new features, events, and cycling tips.',
              value: _marketingConsent,
              isRequired: false,
              onChanged: (value) => setState(() => _marketingConsent = value),
            ),

            const SizedBox(height: 24),

            // Privacy Policy Link
            Center(
              child: TextButton(
                onPressed: () {
                  // Open privacy policy
                },
                child: const Text(
                  'Read our Privacy Policy',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () async {
                      await widget.consentManager.setConsents(
                        location: true,
                        analytics: false,
                        marketing: false,
                      );
                      widget.onCompleted();
                      if (context.mounted) {
                        Navigator.of(context).pop();
                      }
                    },
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      side: const BorderSide(color: AppColors.muted),
                    ),
                    child: Text(
                      'Essential Only',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: context.colors.textPrimary,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: () async {
                      await widget.consentManager.setConsents(
                        location: _locationConsent,
                        analytics: _analyticsConsent,
                        marketing: _marketingConsent,
                      );
                      widget.onCompleted();
                      if (context.mounted) {
                        Navigator.of(context).pop();
                      }
                    },
                    style: FilledButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      minimumSize: const Size.fromHeight(48),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Accept',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConsentTile({
    required IconData icon,
    required String title,
    required String description,
    required bool value,
    required bool isRequired,
    required void Function(bool)? onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: context.colors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.muted),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 24, color: AppColors.primary),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        title,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                          color: context.colors.textPrimary,
                        ),
                      ),
                    ),
                    if (isRequired)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          'Required',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: TextStyle(
                    fontSize: 13,
                    height: 1.4,
                    color: context.colors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Switch(
            value: value,
            onChanged: onChanged,
            activeTrackColor: AppColors.primary,
          ),
        ],
      ),
    );
  }
}
