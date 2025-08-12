import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/EditPet.css";
import { getPetById, updatePet } from "../services/petService";

const EditPet = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "MALE",
    price: "",
    description: "",
    breedId: "",
    petTypeId: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [petTypes, setPetTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPetById(id)
      .then((pet) => {
        setFormData({
          name: pet.name || "",
          age: pet.age || "",
          gender: pet.gender || "MALE",
          price: pet.price || "",
          description: pet.description || "",
          breedId: pet.breedId || "",
          petTypeId: pet.petTypeId || "",
        });
        if (pet.images && Array.isArray(pet.images)) {
          setExistingImages(pet.images);
        }
      })
      .catch(() => {
        alert("Failed to fetch pet details");
      });

    // Mock data
    setPetTypes([
      { id: 1, name: "Dog" },
      { id: 2, name: "Cat" },
      { id: 3, name: "Bird" },
      { id: 4, name: "Fish" },
      { id: 5, name: "Rabbit" },
      { id: 6, name: "Hamster" },
      { id: 7, name: "Turtle" },
      { id: 8, name: "Guinea Pig" },
    ]);

    setBreeds([
      { id: 1, name: "Labrador Retriever", petTypeId: 1 },
      { id: 2, name: "German Shepherd", petTypeId: 1 },
      { id: 3, name: "Pomeranian", petTypeId: 1 },
      { id: 4, name: "Persian", petTypeId: 2 },
      { id: 5, name: "Siamese", petTypeId: 2 },
      { id: 6, name: "Parakeet", petTypeId: 3 },
      { id: 7, name: "Cockatiel", petTypeId: 3 },
      { id: 8, name: "Goldfish", petTypeId: 4 },
      { id: 9, name: "Betta", petTypeId: 4 },
      { id: 10, name: "Holland Lop", petTypeId: 5 },
      { id: 11, name: "Lionhead", petTypeId: 5 },
      { id: 12, name: "Syrian Hamster", petTypeId: 6 },
      { id: 13, name: "Dwarf Hamster", petTypeId: 6 },
      { id: 14, name: "Red-Eared Slider", petTypeId: 7 },
      { id: 15, name: "Russian Tortoise", petTypeId: 7 },
      { id: 16, name: "Abyssinian Guinea Pig", petTypeId: 8 },
      { id: 17, name: "American Guinea Pig", petTypeId: 8 },
      { id: 18, name: "Beagle", petTypeId: 1 },
    ]);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setImages(filesArray);
  };

  const handleRemoveNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("Name", formData.name);
      payload.append("Age", formData.age);
      payload.append("Gender", formData.gender);
      payload.append("Price", formData.price);
      payload.append("Description", formData.description);
      payload.append("BreedId", formData.breedId);
      images.forEach((img) => payload.append("Images", img));

      await updatePet(id, payload);
      alert("Pet updated successfully!");
      navigate("/admin/pets");
    } catch {
      alert("Failed to update pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-pet-container">
      <h2>Edit Pet</h2>
      <form className="edit-pet-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Pet Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Age (Months):</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </div>

        <div className="form-row">
          <label>Price (Rs):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="form-row">
          <label>Pet Type:</label>
          <select name="petTypeId" value={formData.petTypeId} onChange={handleChange} required>
            <option value="">Select Pet Type</option>
            {petTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Breed:</label>
          <select name="breedId" value={formData.breedId} onChange={handleChange} required>
            <option value="">Select Breed</option>
            {breeds
              .filter((b) => b.petTypeId === Number(formData.petTypeId))
              .map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.name}
                </option>
              ))}
          </select>
        </div>

        {existingImages.length > 0 && (
          <div className="image-preview">
            <h4>Existing Images</h4>
            {existingImages.map((img, idx) => (
              <img key={idx} src={`/${img.image_url}`} alt="existing" className="preview-img" />
            ))}
          </div>
        )}

        <div className="form-row">
          <label>Upload New Images:</label>
          <input type="file" multiple onChange={handleImageChange} />
        </div>

        <div className="image-preview">
          {images.map((image, index) => (
            <div key={index} className="image-item">
              <img src={URL.createObjectURL(image)} alt="preview" />
              <button type="button" onClick={() => handleRemoveNewImage(index)}>
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="button-group">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Update Pet"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/admin/pets")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPet;
