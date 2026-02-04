// Patriot Showers Measurement Workbook - Enhanced Application Logic
// Features: Auto-save, Image Compression, Measurement Validation, Quick Retake

let currentSection = 1;
const totalSections = 6;
let photoData = {};
let autosaveTimer = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date();
    document.getElementById('measureDate').value = today.toLocaleDateString('en-US');
    
    // Load saved data from localStorage
    loadFromLocalStorage();
    
    // Initialize progress
    updateProgress();
    
    // Setup checkbox state handlers
    setupCheckboxHandlers();
    
    // Setup auto-save on input changes
    setupAutoSave();
    
    // Update photo count
    updatePhotoCount();
});

// ===== AUTO-SAVE FUNCTIONALITY =====

function setupAutoSave() {
    // Auto-save on any input change
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            scheduleAutoSave();
        }
    });
    
    // Auto-save on checkbox change
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' || e.target.type === 'radio') {
            scheduleAutoSave();
        }
    });
}

function scheduleAutoSave() {
    // Clear existing timer
    if (autosaveTimer) {
        clearTimeout(autosaveTimer);
    }
    
    // Schedule save after 1 second of inactivity
    autosaveTimer = setTimeout(() => {
        saveToLocalStorage();
        showAutoSaveIndicator();
    }, 1000);
}

function saveToLocalStorage() {
    const data = collectFormData();
    localStorage.setItem('patriot_showers_workbook', JSON.stringify(data));
    localStorage.setItem('patriot_showers_photos', JSON.stringify(photoData));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('patriot_showers_workbook');
    const savedPhotos = localStorage.getItem('patriot_showers_photos');
    
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            restoreFormData(data);
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
    
    if (savedPhotos) {
        try {
            photoData = JSON.parse(savedPhotos);
            restorePhotos();
        } catch (e) {
            console.error('Error loading saved photos:', e);
        }
    }
}

function showAutoSaveIndicator() {
    const indicator = document.getElementById('autosaveIndicator');
    indicator.classList.add('show');
    
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

function clearAllData() {
    if (confirm('⚠️ This will delete all saved data and photos. Are you sure you want to start a new workbook?')) {
        localStorage.removeItem('patriot_showers_workbook');
        localStorage.removeItem('patriot_showers_photos');
        photoData = {};
        location.reload();
    }
}

// ===== DATA COLLECTION & RESTORATION =====

function collectFormData() {
    return {
        jobInfo: {
            repName: document.getElementById('repName').value,
            date: document.getElementById('measureDate').value,
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            customerEmail: document.getElementById('customerEmail').value,
            jobAddress: document.getElementById('jobAddress').value
        },
        configuration: {
            showerType: document.querySelector('input[name="showerType"]:checked')?.value,
            newConfig: document.querySelector('input[name="newConfig"]:checked')?.value,
            floorLevel: document.getElementById('floorLevel').value,
            baseType: document.getElementById('baseType').value,
            drainLocation: document.getElementById('drainLocation').value,
            drainAccess: document.getElementById('drainAccess').checked,
            movingDrain: document.getElementById('movingDrain').checked,
            concreteSub: document.getElementById('concreteSub').checked,
            postTension: document.getElementById('postTension').checked,
            fourthWall: document.getElementById('fourthWall').checked,
            manufacturedHome: document.getElementById('manufacturedHome').checked,
            condo: document.getElementById('condo').checked,
            windowInWet: document.getElementById('windowInWet').checked,
            windowDimensions: {
                height: document.getElementById('windowHeight').value,
                width: document.getElementById('windowWidth').value,
                toCeiling: document.getElementById('windowToCeiling').value
            }
        },
        measurements: {
            A: { existing: document.getElementById('measExistingA').value, new: document.getElementById('measNewA').value, notes: document.getElementById('notesA').value },
            B: { existing: document.getElementById('measExistingB').value, new: document.getElementById('measNewB').value, notes: document.getElementById('notesB').value },
            C: { existing: document.getElementById('measExistingC').value, new: document.getElementById('measNewC').value, notes: document.getElementById('notesC').value },
            C2: { existing: document.getElementById('measExistingC2').value, new: document.getElementById('measNewC2').value, notes: document.getElementById('notesC2').value },
            D: { existing: document.getElementById('measExistingD').value, new: document.getElementById('measNewD').value, notes: document.getElementById('notesD').value },
            E: { existing: document.getElementById('measExistingE').value, new: document.getElementById('measNewE').value, notes: document.getElementById('notesE').value },
            E2: { existing: document.getElementById('measExistingE2').value, new: document.getElementById('measNewE2').value, notes: document.getElementById('notesE2').value },
            F: { existing: document.getElementById('measExistingF').value, new: document.getElementById('measNewF').value, notes: document.getElementById('notesF').value },
            G: { existing: document.getElementById('measExistingG').value, new: document.getElementById('measNewG').value, notes: document.getElementById('notesG').value },
            baseToToilet: document.getElementById('measBaseToToilet').value,
            newSurroundHeight: document.getElementById('measNewSurroundHeight').value
        },
        siteConditions: {
            issues: {
                mold: document.getElementById('issueMold').checked,
                noGrabBars: document.getElementById('issueNoGrabBars').checked,
                noAntiSlip: document.getElementById('issueNoAntiSlip').checked,
                failingCaulk: document.getElementById('issueFailingCaulk').checked,
                crackedGrout: document.getElementById('issueCrackedGrout').checked,
                staining: document.getElementById('issueStaining').checked,
                waterDamage: document.getElementById('issueWaterDamage').checked,
                failedDrain: document.getElementById('issueFailedDrain').checked,
                tempPressure: document.getElementById('issueTempPressure').checked,
                leaking: document.getElementById('issueLeaking').checked
            },
            structuralNotes: document.getElementById('structuralNotes').value,
            accessNotes: document.getElementById('accessNotes').value,
            preferredInstallDate: document.getElementById('preferredInstallDate').value,
            bestContactTime: document.getElementById('bestContactTime').value,
            customerRequests: document.getElementById('customerRequests').value,
            additionalNotes: document.getElementById('additionalNotes').value
        }
    };
}

function restoreFormData(data) {
    // Job Info
    if (data.jobInfo) {
        document.getElementById('repName').value = data.jobInfo.repName || '';
        document.getElementById('customerName').value = data.jobInfo.customerName || '';
        document.getElementById('customerPhone').value = data.jobInfo.customerPhone || '';
        document.getElementById('customerEmail').value = data.jobInfo.customerEmail || '';
        document.getElementById('jobAddress').value = data.jobInfo.jobAddress || '';
    }
    
    // Configuration
    if (data.configuration) {
        if (data.configuration.showerType) {
            const radio = document.querySelector(`input[name="showerType"][value="${data.configuration.showerType}"]`);
            if (radio) {
                radio.checked = true;
                radio.closest('.radio-item').classList.add('selected');
            }
        }
        if (data.configuration.newConfig) {
            const radio = document.querySelector(`input[name="newConfig"][value="${data.configuration.newConfig}"]`);
            if (radio) {
                radio.checked = true;
                radio.closest('.radio-item').classList.add('selected');
            }
        }
        document.getElementById('floorLevel').value = data.configuration.floorLevel || '';
        document.getElementById('baseType').value = data.configuration.baseType || '';
        document.getElementById('drainLocation').value = data.configuration.drainLocation || '';
        
        // Checkboxes
        document.getElementById('drainAccess').checked = data.configuration.drainAccess || false;
        document.getElementById('movingDrain').checked = data.configuration.movingDrain || false;
        document.getElementById('concreteSub').checked = data.configuration.concreteSub || false;
        document.getElementById('postTension').checked = data.configuration.postTension || false;
        document.getElementById('fourthWall').checked = data.configuration.fourthWall || false;
        document.getElementById('manufacturedHome').checked = data.configuration.manufacturedHome || false;
        document.getElementById('condo').checked = data.configuration.condo || false;
        document.getElementById('windowInWet').checked = data.configuration.windowInWet || false;
        
        // Trigger checkbox visual updates
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (cb.checked) {
                cb.closest('.checkbox-item')?.classList.add('checked');
            }
        });
        
        // Window dimensions
        if (data.configuration.windowDimensions) {
            document.getElementById('windowHeight').value = data.configuration.windowDimensions.height || '';
            document.getElementById('windowWidth').value = data.configuration.windowDimensions.width || '';
            document.getElementById('windowToCeiling').value = data.configuration.windowDimensions.toCeiling || '';
        }
    }
    
    // Measurements
    if (data.measurements) {
        ['A', 'B', 'C', 'C2', 'D', 'E', 'E2', 'F', 'G'].forEach(key => {
            if (data.measurements[key]) {
                document.getElementById(`measExisting${key}`).value = data.measurements[key].existing || '';
                document.getElementById(`measNew${key}`).value = data.measurements[key].new || '';
                document.getElementById(`notes${key}`).value = data.measurements[key].notes || '';
            }
        });
        document.getElementById('measBaseToToilet').value = data.measurements.baseToToilet || '';
        document.getElementById('measNewSurroundHeight').value = data.measurements.newSurroundHeight || '';
    }
    
    // Site Conditions
    if (data.siteConditions) {
        if (data.siteConditions.issues) {
            Object.keys(data.siteConditions.issues).forEach(key => {
                const checkbox = document.getElementById(`issue${key.charAt(0).toUpperCase() + key.slice(1)}`);
                if (checkbox) {
                    checkbox.checked = data.siteConditions.issues[key];
                    if (checkbox.checked) {
                        checkbox.closest('.checkbox-item')?.classList.add('checked');
                    }
                }
            });
        }
        document.getElementById('structuralNotes').value = data.siteConditions.structuralNotes || '';
        document.getElementById('accessNotes').value = data.siteConditions.accessNotes || '';
        document.getElementById('preferredInstallDate').value = data.siteConditions.preferredInstallDate || '';
        document.getElementById('bestContactTime').value = data.siteConditions.bestContactTime || '';
        document.getElementById('customerRequests').value = data.siteConditions.customerRequests || '';
        document.getElementById('additionalNotes').value = data.siteConditions.additionalNotes || '';
    }
}

// ===== PHOTO HANDLING WITH COMPRESSION =====

function triggerPhotoUpload(inputId) {
    document.getElementById(inputId).click();
}

async function handlePhotoUpload(input, previewId) {
    const file = input.files[0];
    if (file) {
        try {
            // Compress image before storing
            const compressedDataUrl = await compressImage(file);
            
            const previewDiv = document.getElementById(previewId);
            const parentBox = previewDiv.closest('.photo-upload-box');
            
            previewDiv.innerHTML = `
                <img src="${compressedDataUrl}" alt="Preview">
                <button class="remove-photo" onclick="removePhoto('${input.id}', '${previewId}', event)">×</button>
            `;
            parentBox.classList.add('has-image');
            
            // Store compressed photo data
            photoData[input.id] = {
                name: file.name,
                data: compressedDataUrl,
                originalSize: file.size,
                compressedSize: Math.round(compressedDataUrl.length * 0.75) // Approximate
            };
            
            updatePhotoCount();
            scheduleAutoSave();
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image. Please try again.');
        }
    }
}

function compressImage(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with compression
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function removePhoto(inputId, previewId, event) {
    event.stopPropagation();
    
    if (!confirm('Remove this photo? You can retake it by tapping the box again.')) {
        return;
    }
    
    const input = document.getElementById(inputId);
    const previewDiv = document.getElementById(previewId);
    const parentBox = previewDiv.closest('.photo-upload-box');
    
    input.value = '';
    delete photoData[inputId];
    
    // Restore original content based on label
    const labels = {
        'previewBathroomEntry': { icon: '📷', label: 'Bathroom Entry', instruction: 'Full view from doorway' },
        'previewFloorLine': { icon: '📷', label: 'Base & Floor Line', instruction: 'Show base and floor transition' },
        'previewBottomRight': { icon: '📷', label: 'Bottom Right Corner', instruction: 'Floor to mid-wall, right side' },
        'previewTopRight': { icon: '📷', label: 'Top Right Corner', instruction: 'Mid-wall to ceiling, right side' },
        'previewBottomLeft': { icon: '📷', label: 'Bottom Left Corner', instruction: 'Floor to mid-wall, left side' },
        'previewTopLeft': { icon: '📷', label: 'Top Left Corner', instruction: 'Mid-wall to ceiling, left side' },
        'previewBMeasurement': { icon: '📷', label: 'B Measurement', instruction: 'Show tape measure depth' },
        'previewCurbToToilet': { icon: '📷', label: 'Curb to Toilet Distance', instruction: 'Measure curb to toilet center' },
        'previewWaterShutoff': { icon: '📷', label: 'Water Shut-off Valve', instruction: 'Location and accessibility' },
        'previewElectricalPanel': { icon: '📷', label: 'Electrical Panel', instruction: 'Main panel location' },
        'previewWindow': { icon: '📷', label: 'Window (if present)', instruction: 'Show position in wet area' },
        'previewPostTension': { icon: '📷', label: 'Post Tension Stamp', instruction: 'If visible in garage/basement' },
        'previewMisc1': { icon: '📷', label: 'Additional Photo 1', instruction: 'Any damage or special conditions' },
        'previewMisc2': { icon: '📷', label: 'Additional Photo 2', instruction: 'Optional' },
        'previewMisc3': { icon: '📷', label: 'Additional Photo 3', instruction: 'Optional' },
        'previewMisc4': { icon: '📷', label: 'Additional Photo 4', instruction: 'Optional' }
    };
    
    const content = labels[previewId];
    if (content) {
        previewDiv.innerHTML = `
            <div class="upload-icon">${content.icon}</div>
            <div class="photo-label">${content.label}</div>
            <div class="photo-instruction">${content.instruction}</div>
        `;
    }
    
    parentBox.classList.remove('has-image');
    updatePhotoCount();
    scheduleAutoSave();
}

function restorePhotos() {
    Object.keys(photoData).forEach(inputId => {
        const photo = photoData[inputId];
        const previewId = inputId.replace('photo', 'preview');
        const previewDiv = document.getElementById(previewId);
        const parentBox = previewDiv?.closest('.photo-upload-box');
        
        if (previewDiv && parentBox) {
            previewDiv.innerHTML = `
                <img src="${photo.data}" alt="Preview">
                <button class="remove-photo" onclick="removePhoto('${inputId}', '${previewId}', event)">×</button>
            `;
            parentBox.classList.add('has-image');
        }
    });
    updatePhotoCount();
}

function updatePhotoCount() {
    const count = Object.keys(photoData).length;
    const badge = document.getElementById('photoCount');
    if (badge) {
        badge.textContent = count;
    }
}

// ===== MEASUREMENT VALIDATION =====

function validateMeasurements() {
    const warnings = [];
    
    // Get key measurements
    const widthNew = parseFloat(document.getElementById('measNewA').value);
    const depthNew = parseFloat(document.getElementById('measNewB').value);
    const heightNew = parseFloat(document.getElementById('measNewD').value);
    
    // Validate width (A)
    if (widthNew && (widthNew < 28 || widthNew > 72)) {
        warnings.push('⚠️ Width (A) seems unusual: ' + widthNew + '". Typical range is 28-72 inches.');
    }
    
    // Validate depth (B)
    if (depthNew && (depthNew < 28 || depthNew > 72)) {
        warnings.push('⚠️ Depth (B) seems unusual: ' + depthNew + '". Typical range is 28-72 inches.');
    }
    
    // Validate height (D)
    if (heightNew && (heightNew < 72 || heightNew > 120)) {
        warnings.push('⚠️ Height (D) seems unusual: ' + heightNew + '". Typical range is 72-120 inches.');
    }
    
    // Check if C/C2 make sense relative to B
    const cNew = parseFloat(document.getElementById('measNewC').value);
    const c2New = parseFloat(document.getElementById('measNewC2').value);
    
    if (cNew && depthNew && cNew > depthNew + 6) {
        warnings.push('⚠️ Right corner measurement (C) is larger than depth (B). Please verify.');
    }
    
    if (c2New && depthNew && c2New > depthNew + 6) {
        warnings.push('⚠️ Right surround (C2) is larger than depth (B). Please verify.');
    }
    
    // Check E/E2 relative to B
    const eNew = parseFloat(document.getElementById('measNewE').value);
    const e2New = parseFloat(document.getElementById('measNewE2').value);
    
    if (eNew && depthNew && eNew > depthNew + 6) {
        warnings.push('⚠️ Left corner measurement (E) is larger than depth (B). Please verify.');
    }
    
    if (e2New && depthNew && e2New > depthNew + 6) {
        warnings.push('⚠️ Left surround (E2) is larger than depth (B). Please verify.');
    }
    
    // Display warnings
    const warningsDiv = document.getElementById('measurementWarnings');
    if (warnings.length > 0) {
        warningsDiv.innerHTML = `
            <div class="alert-warning">
                <strong>Measurement Validation:</strong>
                <ul style="margin: 8px 0 0 20px;">
                    ${warnings.map(w => `<li>${w}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        warningsDiv.innerHTML = '';
    }
}

// ===== CHECKBOX & RADIO HANDLERS =====

function setupCheckboxHandlers() {
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const checkboxItem = e.target.closest('.checkbox-item');
            if (checkboxItem) {
                if (e.target.checked) {
                    checkboxItem.classList.add('checked');
                } else {
                    checkboxItem.classList.remove('checked');
                }
            }
        }
        
        // Show window dimensions if window checkbox is checked
        if (e.target.id === 'windowInWet') {
            const windowGroup = document.getElementById('windowDimensionsGroup');
            if (e.target.checked) {
                windowGroup.classList.remove('section-hidden');
            } else {
                windowGroup.classList.add('section-hidden');
            }
        }
    });
    
    // Handle radio button selections
    document.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            const radioGroup = e.target.closest('.radio-group');
            if (radioGroup) {
                radioGroup.querySelectorAll('.radio-item').forEach(item => {
                    item.classList.remove('selected');
                });
                e.target.closest('.radio-item').classList.add('selected');
            }
        }
    });
}

// ===== SHOWER TYPE UPDATE =====

function updateShowerType() {
    const showerType = document.querySelector('input[name="showerType"]:checked');
    if (showerType) {
        document.querySelectorAll('#showerTypeGroup .radio-item').forEach(item => {
            item.classList.remove('selected');
        });
        showerType.closest('.radio-item').classList.add('selected');
    }
}

// ===== NAVIGATION =====

function nextSection(current) {
    if (validateSection(current)) {
        currentSection = current + 1;
        updateDisplay();
    }
}

function previousSection(current) {
    currentSection = current - 1;
    updateDisplay();
}

function validateSection(sectionNum) {
    let isValid = true;
    let errorMessage = '';

    switch(sectionNum) {
        case 1:
            const repName = document.getElementById('repName').value;
            const customerName = document.getElementById('customerName').value;
            const jobAddress = document.getElementById('jobAddress').value;
            
            if (!repName || !customerName || !jobAddress) {
                errorMessage = 'Please fill in all required fields (marked with *)';
                isValid = false;
            }
            break;
        
        case 2:
            const showerType = document.querySelector('input[name="showerType"]:checked');
            if (!showerType) {
                errorMessage = 'Please select an existing shower type';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        alert(errorMessage);
    }
    
    return isValid;
}

function updateDisplay() {
    // Hide all sections
    for (let i = 1; i <= totalSections; i++) {
        document.getElementById(`section${i}`).classList.add('section-hidden');
    }
    
    // Show current section
    document.getElementById(`section${currentSection}`).classList.remove('section-hidden');
    
    // Update progress
    updateProgress();
    
    // Generate summary if on last section
    if (currentSection === totalSections) {
        generateSummary();
    }
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        
        if (stepNum === currentSection) {
            step.classList.add('active');
        } else if (stepNum < currentSection) {
            step.classList.add('completed');
        }
    });
    
    // Update progress bar with smooth animation
    const progressPercent = ((currentSection - 1) / (totalSections - 1)) * 100;
    document.getElementById('progressLine').style.width = `${progressPercent}%`;
}

// ===== SUMMARY GENERATION =====

function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    
    let html = '<div class="summary-section">';
    html += '<h3 class="subsection-title">Job Information</h3>';
    html += `<div class="summary-item"><span class="summary-label">Sales Rep:</span><span class="summary-value">${document.getElementById('repName').value}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Date:</span><span class="summary-value">${document.getElementById('measureDate').value}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Customer:</span><span class="summary-value">${document.getElementById('customerName').value}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Address:</span><span class="summary-value">${document.getElementById('jobAddress').value}</span></div>`;
    html += '</div>';
    
    html += '<div class="summary-section">';
    html += '<h3 class="subsection-title">Shower Configuration</h3>';
    const showerType = document.querySelector('input[name="showerType"]:checked');
    html += `<div class="summary-item"><span class="summary-label">Shower Type:</span><span class="summary-value">${showerType ? showerType.value : 'Not selected'}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Floor Level:</span><span class="summary-value">${document.getElementById('floorLevel').value || 'Not specified'}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Base Type:</span><span class="summary-value">${document.getElementById('baseType').value || 'Not specified'}</span></div>`;
    html += '</div>';
    
    html += '<div class="summary-section">';
    html += '<h3 class="subsection-title">Photos Uploaded</h3>';
    const photoCount = Object.keys(photoData).length;
    html += `<div class="summary-item"><span class="summary-label">Total Photos:</span><span class="summary-value">${photoCount} photos</span></div>`;
    
    // Calculate total photo size
    let totalSize = 0;
    Object.values(photoData).forEach(photo => {
        totalSize += photo.compressedSize || 0;
    });
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    html += `<div class="summary-item"><span class="summary-label">Total Size:</span><span class="summary-value">${totalSizeMB} MB (compressed)</span></div>`;
    html += '</div>';
    
    html += '<div class="summary-section">';
    html += '<h3 class="subsection-title">Key Measurements</h3>';
    html += `<div class="summary-item"><span class="summary-label">A (Width):</span><span class="summary-value">${document.getElementById('measNewA').value || 'Not measured'}"</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">B (Depth):</span><span class="summary-value">${document.getElementById('measNewB').value || 'Not measured'}"</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">D (Height):</span><span class="summary-value">${document.getElementById('measNewD').value || 'Not measured'}"</span></div>`;
    html += '</div>';
    
    // Count checked issues
    const issueChecks = document.querySelectorAll('#section5 input[type="checkbox"]:checked');
    if (issueChecks.length > 0) {
        html += '<div class="summary-section">';
        html += '<h3 class="subsection-title">Site Issues Identified</h3>';
        issueChecks.forEach(check => {
            const label = check.closest('.checkbox-item').textContent.trim();
            html += `<div class="summary-item"><span class="summary-value">⚠️ ${label}</span></div>`;
        });
        html += '</div>';
    }
    
    summaryContent.innerHTML = html;
}

// ===== DATA EXPORT =====

function exportData() {
    const data = collectFormData();
    data.photos = photoData;
    data.exportDate = new Date().toISOString();
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const customerName = document.getElementById('customerName').value.replace(/\s+/g, '-') || 'customer';
    link.download = `patriot-showers-workbook-${customerName}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('✓ Workbook data downloaded successfully!\n\nAll photos are compressed and included in the file.');
}
